import {
  useContext,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
// import Router from 'next/router';
import { useIntl } from 'react-intl';
import composeRefs from '@seznam/compose-react-refs';
import classNames from 'classnames';
import {
  WindowScroller,
  InfiniteLoader,
  CellMeasurerCache,
  CellMeasurer,
  List,
} from 'react-virtualized';
import { selectCurrentUser } from '@/modules/auth/selectors';

// import commonMessages from '@/messages/common';
import { BEGINNING_PIVOT, TAILING_PIVOT } from '../../constants';
import {
  NodeContext,
  BundleContext,
  UserCapabilitiesContext,
  ScrollContext,
} from '../../context';
import {
  commitMediaBlock,
  submitMediaBlock,
  asyncBatchParagraph,
} from '../../actions';

import ContentDropzone from './ContentDropzone';
import RewordableSection from '../RewordableSection';
import ContentBlockRender from '../ContentBlockRender';
import AppendingBlock from '../AppendingBlock';
import DropHint from '../DropHint';
import MeasureObserver from './MeasureObserver';
import BlockSectionPlaceholder from '../BlockSectionPlaceholder';
import BlockTailingWidget from '../BlockTailingWidget';
import intlMessages from '../../messages';
import { getActiveHash } from './utils';
import { isContentHash } from '../../utils/router';

// import { getNodeCache } from '../../utils/cache';
import {
  combineBlockList,
  isAppendingBlock,
  isInternalBlock,
} from '../../utils/content';

const PARA_NUM_OFFSET = 56;
const CONTENT_WIDTH = 600; // 需要与 dz-Edit__main 同步修改
const ELEMENT_DEFAULT_HEIGHT = 200;
const DEFAULT_CHUNK_SIZE = 30;

// debounce

class RequestControl {
  requesting = new Map();

  batch(dispatch, ids) {
    const [requesting, not_yet] = ids.reduce(
      ([requesting, not_yet], id) =>
        this.requesting.has(id)
          ? [requesting.concat([this.requesting.get(id)]), not_yet]
          : [requesting, not_yet.concat([id])],
      [[], []],
    );
    if (not_yet.length) {
      const promise = dispatch(asyncBatchParagraph({ ids: not_yet })).then(() =>
        not_yet.forEach((id) => this.requesting.delete(id)),
      );
      not_yet.map((id) => this.requesting.set(id, promise));
      requesting.push(promise);
    }
    return Promise.all(requesting);
  }
}

const cacheControl = {
  data: {},
  timer: {},
};
const useMeasureCache = (nodeId) => {
  if (!cacheControl.data[nodeId]) {
    cacheControl.data[nodeId] = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: ELEMENT_DEFAULT_HEIGHT,
    });
  }
  useEffect(
    () => {
      clearTimeout(cacheControl.timer[nodeId]);
      return () => {
        cacheControl.timer[nodeId] = setTimeout(() => {
          delete cacheControl.data[nodeId];
        }, 300000); // 5 miniutes
      };
    },
    [nodeId],
  );
  return cacheControl.data[nodeId];
};

// Dropzone feature
// InfiniteLoader
function NodeContent(props) {
  const { formatMessage } = useIntl();
  const nodeState = useContext(NodeContext);
  const bundleState = useContext(BundleContext);
  const userCapabilities = useContext(UserCapabilitiesContext);
  const currentUser = useSelector(selectCurrentUser);
  const scrollContext = useContext(ScrollContext);
  const dispatch = useDispatch();
  const domRef = useRef(null);
  const [beginIndex, setBeginIndex] = useState(0);
  const measureCache = useMeasureCache(props.nodeId);

  const { mode } = bundleState;
  const {
    basic: nodeBasic,
    contentList,
    blocks,
    appendings,
    outline,
  } = nodeState;

  const rControl = useRef(new RequestControl());

  // 将插入段落以及内容列表组合在一起，形成完整的渲染列表
  const blockList = useMemo(
    () => combineBlockList(contentList, appendings, userCapabilities),
    [contentList, appendings, userCapabilities],
  );

  const scrollToIndex = useMemo(
    () => {
      if (isContentHash(scrollContext.scrollHash)) {
        const blockId = scrollContext.scrollHash.replace('#content-', '');
        // eslint-disable-next-line eqeqeq
        const index = blockList.findIndex((id) => id == blockId);
        return index > -1 ? index : undefined;
      }
      // 通过虚拟 #tailing 定位到内容底部
      if (scrollContext.scrollHash === '#tailing') {
        return blockList.length - 1;
      }
      return undefined;
    },
    [blockList, scrollContext.scrollHash],
  );

  // 在渲染前强行将页面定位到底部
  if (scrollContext.scrollHash === '#tailing') {
    document.documentElement.scrollTop =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
  }

  // blockLoaded
  const isBlockLoaded = ({ index }) => {
    const blockId = blockList[index];
    return isInternalBlock(blockId) || blocks[blockId];
  };

  // getBlockData
  const getBlockKey = (index) => blockList[index];
  const getBlockData = (index) => {
    const key = blockList[index];
    if (key === BEGINNING_PIVOT) {
      return {
        component: BlockTailingWidget,
        props: {
          disabled:
            !!appendings[BEGINNING_PIVOT] || !userCapabilities.canAppendContent,
          blockId: BEGINNING_PIVOT,
          bundleId: nodeBasic.bundle_id,
          nodeId: nodeBasic.id,
          style: {
            counterIncrement: 'para',
          },
        },
      };
    }
    if (!key) {
      // loading...
      return {
        component: BlockSectionPlaceholder,
        props: {
          dataIndex: index,
        },
      };
    }
    // is appending;
    if (key[0] === 'a') {
      const [, pivotId] = key.split('.');
      return {
        component: AppendingBlock,
        props: {
          bundleId: nodeBasic.bundle_id,
          nodeId: nodeBasic.id,
          pivotId,
          userCapabilities,
          key,
          placeholder:
            key === `a.${TAILING_PIVOT}`
              ? formatMessage(intlMessages.tailingEditorPlaceholder)
              : formatMessage(intlMessages.insertEditorPlaceholder),
          currentUser,
        },
      };
    }
    const block = blocks[key];
    if (block) {
      const name = `content-${block.id}`;
      return {
        component: RewordableSection,
        props: {
          key: block.id,
          mode,
          structure: 'content',
          bundleId: nodeBasic.bundle_id,
          nodeId: nodeBasic.id,
          blockId: block.id,
          info: block.info,
          rewordings: block.rewordings,
          status: block.status,
          sort: block.sort,
          isLastBlock: index + 1 === contentList.length,
          currentUser,
          userCapabilities,
          render: ContentBlockRender,
          name,
          shouldHighlighted: scrollContext.scrollHash === `#${name}`,
          hasAppendingBlock: appendings[key],
        },
      };
    }
    return {
      component: BlockSectionPlaceholder,
      props: {
        dataIndex: index,
      },
    };
  };

  // eslint-disable-next-line arrow-body-style
  const tryToLoadBlocks = ({ startIndex, stopIndex }) => {
    // console.log(startIndex, stopIndex);
    const ids = blockList.filter(
      (v, i) => i >= startIndex && i <= stopIndex && !isBlockLoaded(i),
    );

    return rControl.current.batch(dispatch, ids);
  };

  const handleRowsRendered = (info) => {
    setBeginIndex(info.overscanStartIndex);
    const activeSection = getActiveHash(outline, info);
    if (activeSection !== scrollContext.activeSection) {
      logging.debug(
        'updateActiveSection tirgger by handleRowsRendered',
        activeSection,
      );
      scrollContext.setActiveSection(activeSection);
    }
    // TO_ENHANCE: if hasInitScroll then restore.
    // if (hasInitScrolled.current) {
    //   console.log('update Cache');
    //   const cache = getNodeCache(nodeBasic.id);
    //   cache &&
    //     cache.set('contentScroll', {
    //       activeSection,
    //       startIndex: info.startIndex,
    //       blockId: blockList[info.startIndex],
    //     });
    // }
  };

  // update width --- start
  // ------
  const [width, setWidth] = useState(CONTENT_WIDTH);
  useEffect(() => {
    const updateWidth = () => {
      if (domRef.current) {
        const { clientWidth } = domRef.current;
        setWidth(clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);
  // update width -- end

  const shouldHandle = useCallback((e) => {
    const isInRewordingDropzone = !!e.target.closest('.dz-RewordingDropzone');
    return !isInRewordingDropzone;
  }, []);

  const handleDrop = useCallback(
    ({ pivotIndex, file }) => {
      const creator = userCapabilities.canElect
        ? commitMediaBlock
        : submitMediaBlock;
      const dropPivotIndex = beginIndex + pivotIndex;
      const pivotId =
        dropPivotIndex === -1 ? BEGINNING_PIVOT : blockList[dropPivotIndex];
      if (!pivotId) {
        return;
      }
      dispatch(
        creator({
          bundleId: nodeBasic.bundle_id,
          nodeId: nodeBasic.id,
          pivotId,
          file,
        }),
      );
    },
    [blockList, beginIndex, nodeBasic],
  );

  return (
    <InfiniteLoader
      isRowLoaded={isBlockLoaded}
      loadMoreRows={tryToLoadBlocks}
      rowCount={blockList.length}
      threshold={DEFAULT_CHUNK_SIZE}
    >
      {({ onRowsRendered, registerChild }) => (
        <WindowScroller key={nodeBasic.id}>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <ContentDropzone
              itemSelector=".dz-BlockSectionWrap"
              shouldHandle={shouldHandle}
              isValidPivot={(index) => {
                const blockIndex = beginIndex + index;
                if (blockIndex === -1) {
                  return false;
                }
                const key = blockList[blockIndex];
                return !isAppendingBlock(key);
              }}
              onDrop={handleDrop}
              fileTypeNotSupportedHint={formatMessage(
                intlMessages.fileTypeNotSupported,
              )}
            >
              {({ domRef: zoomRef, active, getOffsetStyle, hintOffset }) => (
                <div
                  ref={composeRefs(domRef, zoomRef)}
                  className={classNames(
                    'dz-BlockSectionContainer',
                    props.className,
                  )}
                  style={{
                    left: -1 * PARA_NUM_OFFSET,
                    position: 'relative',
                  }}
                >
                  <List
                    autoHeight
                    height={height}
                    ref={registerChild}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    rowCount={blockList.length}
                    rowHeight={measureCache.rowHeight}
                    scrollTop={scrollTop}
                    deferredMeasurementCache={measureCache}
                    scrollToIndex={scrollToIndex}
                    width={width + PARA_NUM_OFFSET}
                    onRowsRendered={(info) => {
                      handleRowsRendered(info);
                      onRowsRendered(info);
                    }}
                    tabIndex={-1}
                    // overscanRowCount={8}
                    style={{
                      counterReset: `para ${beginIndex - 1}`,
                    }}
                    rowRenderer={({ index, key, parent, style }) => {
                      const dropzoneStyle = getOffsetStyle(index - beginIndex);
                      const blockStyle = {
                        ...style,
                        ...dropzoneStyle,
                        paddingLeft: PARA_NUM_OFFSET,
                      };
                      const blockKey = getBlockKey(index);
                      const blockSection = getBlockData(index, isScrolling);
                      const {
                        component: Compo,
                        props: compoProps,
                      } = blockSection;
                      return (
                        <CellMeasurer
                          key={key}
                          cache={measureCache}
                          parent={parent}
                          columnIndex={0}
                          rowIndex={index}
                        >
                          {(cellMeasure) => (
                            <MeasureObserver
                              customKey={blockKey}
                              {...cellMeasure}
                              className="dz-BlockSectionWrap"
                              style={blockStyle}
                            >
                              <Compo {...compoProps} />
                            </MeasureObserver>
                          )}
                        </CellMeasurer>
                      );
                    }}
                  />
                  {active && (
                    <DropHint
                      left={PARA_NUM_OFFSET}
                      top={hintOffset + 8}
                      height={2}
                    />
                  )}
                </div>
              )}
            </ContentDropzone>
          )}
        </WindowScroller>
      )}
    </InfiniteLoader>
  );
}
NodeContent.propTypes = {
  className: PropTypes.string,
  isActive: PropTypes.bool,
};
NodeContent.defaultProps = {
  isActive: true,
};
export default NodeContent;
