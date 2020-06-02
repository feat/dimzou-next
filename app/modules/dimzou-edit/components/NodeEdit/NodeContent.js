import { useContext, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  WindowScroller,
  CellMeasurerCache,
  CellMeasurer,
  List,
} from 'react-virtualized'

import { selectCurrentUser } from '@/modules/auth/selectors';
import { formatMessage } from '@/services/intl';
import message from '@feat/feat-ui/lib/message';

import {
  BEGINNING_PIVOT,
  TAILING_PIVOT,
} from '../../constants';
import { NodeContext, BundleContext, UserCapabilitiesContext, MeasureContext, ScrollContext } from '../../context';

import {
  commitMediaBlock,
  submitMediaBlock,
} from '../../actions';

import RewordableSection from '../RewordableSection';
import ContentBlockRender from '../ContentBlockRender';
import AppendingBlock from '../AppendingBlock';
import DropHint from '../DropHint';
import intlMessages from '../../messages';
import { getActiveHash } from './utils';


const TRANSITION_DURATION = 100
const DROP_REGION_HEIGHT = 40
const PARA_NUM_OFFSET = 56;
const CONTENT_WIDTH = 720;
const ELEMENT_DEFAULT_HEIGHT = 160;

function NodeContent(props) {
  const nodeState = useContext(NodeContext);
  const bundleState = useContext(BundleContext);
  const userCapabilities = useContext(UserCapabilitiesContext);
  const currentUser = useSelector(selectCurrentUser);
  const scrollContext = useContext(ScrollContext);
  const dispatch = useDispatch();

  const domRef = useRef(null);
  const nameIndexMap = useRef({});
  const [beginIndex, setBeginIndex] = useState(0);

  const { mode } = bundleState;
  const { data: node, appendings, outline } = nodeState;
  const { content } = node;

  // react-virtualized related
  const cacheRef = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: ELEMENT_DEFAULT_HEIGHT,
    })
  )

  const blockSections = useMemo(() => {
    const sections = [];
    let counter = 0;
    if (!content) {
      return sections;
    }
    const blockCount = content.length;
    const lastBlockId = blockCount
      ? content[blockCount - 1].id
      : BEGINNING_PIVOT;
  
    
    content.forEach((block, index) => {
      const appendingBlock = appendings[block.id];
      sections.push({
        component: RewordableSection,
        props: {
          key: block.id,
          mode,
          structure: 'content',
          bundleId: node.bundle_id,
          nodeId: node.id,
          blockId: block.id,
          info: block.info,
          rewordings: block.rewordings,
          status: block.status,
          sort: block.sort,
          isLastBlock: index + 1 === blockCount,
          currentUser,
          userCapabilities,
          render: ContentBlockRender,
          name: `content-${block.id}`,
        },
      })
      nameIndexMap.current[`content-${block.id}`] = counter;
      counter += 1;
    
      if (appendingBlock) {
        sections.push({
          component: AppendingBlock,
          props: {
            bundleId: node.bundle_id,
            nodeId: node.id,
            pivotId: block.id,
            userCapabilities,
            key: `appending_${block.id}`,
            placeholder: formatMessage(intlMessages.insertEditorPlaceholder),
            currentUser,
          },
        })
        counter += 1;
      }
    });
  
    if (
      userCapabilities.canEdit &&
      userCapabilities.canAppendContent &&  
      Object.keys(appendings).length === 0
    ) {
      sections.push({
        component: AppendingBlock,
        props: {
          bundleId: node.bundle_id,
          nodeId: node.id,
          pivotId: TAILING_PIVOT,
          lastBlockId,
          userCapabilities,
          key: TAILING_PIVOT,
          placeholder: formatMessage(intlMessages.tailingEditorPlaceholder),
          currentUser,
        },
      })
    }
    return sections;
  }, [content, appendings, userCapabilities])

  // update width --- start
  // ------
  const [width, setWidth] = useState(CONTENT_WIDTH);
  useEffect(() => {
    const updateWidth = () => {
      if (domRef.current) {
        const { clientWidth } = domRef.current;
        setWidth(clientWidth);
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    }
  }, []);
  // update width -- end

  // image upload feature -- start
  // ------
  const [dropPivotIndex, setDropPivotIndex] = useState(null)
  const [inDropzone, setInDropZone] = useState(false)
  const pointerY = useRef(null)
  const getTop = useCallback(() => {
    const offset = dropPivotIndex - beginIndex
    if (offset === -1) {
      return 0
    }
    const block = domRef.current.querySelectorAll('.dz-BlockSectionWrap')[offset]
    if (!block) {
      return 0
    }
    return block.offsetTop + block.clientHeight
  }, [dropPivotIndex, beginIndex])


  useEffect(() => {
    const dom = domRef.current;
    const handleDropOver = (e) => {
      if (!inDropzone) {
        return;
      }
      const isInRewordingDropzone = !!e.target.closest('.dz-RewordingDropzone');
      if (isInRewordingDropzone) {
        if (inDropzone) {
          setInDropZone(false);
        }
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      
      // if (e.dataTransfer.files && e.dataTransfer.files.length) {
      //   setInDropZone(true)
      // }
      const { clientY } = e
      if (clientY !== pointerY.current) {
        pointerY.current = clientY
        const blocks = domRef.current.querySelectorAll('.dz-BlockSection')
        let blockIndex
        for (let i = 0; i < blocks.length; i +=1) {
          const block = blocks[i];
          if (!block) {
            continue;
          }
          const box = block.getBoundingClientRect()
          const { top, height } = box
          // logging.debug(top, height, clientY)
          if (top + height / 2 > clientY) {
            blockIndex = i - 1
            break;
          }
          if (top + height > clientY) {
            blockIndex = i
            break;
          }
        }
        // logging.debug(blockIndex);
        if (blockIndex !== undefined) {
          setDropPivotIndex(beginIndex + blockIndex);
        }
      }
    }

    const handleDragEnter = (e) => {
      const { dataTransfer } = e
      logging.debug('enter')
      e.stopPropagation()
      e.preventDefault()
      if (dataTransfer.types && dataTransfer.types[0] === 'Files') {
        logging.debug('active')
        setInDropZone(true);
        // setFileDropActive(true)
      }
    }

    const handleDragLeave = (e) => {
      logging.debug('leave')
      if (!inDropzone) {
        return;
      }
      e.stopPropagation()
      e.preventDefault()
      // logging.debug(e.target, e.relatedTarget)
      if (e.target.contains(e.relatedTarget) || dom.contains(e.relatedTarget)) {
        return
      }
      setInDropZone(false)
    }
    const handleDragEnd = (e) => {
      logging.debug('end')
      if (!inDropzone) {
        return;
      }
      e.stopPropagation()
      e.preventDefault()
      // setFileDropActive(false)
    }

    const handleDrop = (e) => {
      logging.debug('drop')
      if (!inDropzone) {
        return;
      }
      e.preventDefault()
      e.stopPropagation()
      const file = e.dataTransfer.files[0];
      if (/^image\/.*/.test(file.type)) {
        const creator = userCapabilities.canElect ? commitMediaBlock : submitMediaBlock;
        // create media block;
        if (!blockSections) {
          return ;
        }
        dispatch(creator({
          bundleId: node.bundle_id,
          nodeId: node.id,
          pivotId: dropPivotIndex === -1 ? BEGINNING_PIVOT : blockSections[dropPivotIndex].props.blockId,
          file,
        }));
      } else {
        message.error(formatMessage(intlMessages.fileTypeNotSupported));
        logging.warn(`DIMZOU_UPLOAD_TYPE_RECEIVED: ${file.type}`);
      }
      setInDropZone(false)
    }

    dom.addEventListener('dragenter', handleDragEnter)
    dom.addEventListener('dragend', handleDragEnd)
    dom.addEventListener('dragover', handleDropOver)
    dom.addEventListener('dragleave', handleDragLeave)
    dom.addEventListener('drop', handleDrop)
    // window.addEventListener('drop', (e) => {
    //   e.preventDefault()
    // })
    // window.addEventListener('dragover', (e) => {
    //   e.preventDefault()
    // })
    return () => {
      dom.removeEventListener('dragenter', handleDragEnter)
      dom.removeEventListener('dragend', handleDragEnd)
      dom.removeEventListener('dragover', handleDropOver)
      dom.removeEventListener('dragleave', handleDragLeave)
      dom.removeEventListener('drop', handleDrop)
    }
  }, [beginIndex, inDropzone, blockSections, dropPivotIndex])


  // const [hash, setHash] = useState(workspace.hash);
  const renderInfoRef = useRef(null);
  function scrollToHash(hash, renderInfo) {
    const index = nameIndexMap.current[hash.replace('#', '')]
    if (index === undefined || !renderInfo) {
      return;
    }
    scrollContext.onScrollStarted();
    if (renderInfo.overscanStartIndex <= index && renderInfo.overscanStopIndex >= index) {
      const dom = document.querySelector(hash);  
      if (dom) {
        dom.scrollIntoView(true);
        setTimeout(() => {
          scrollContext.onScrollFinished();
        }, 500);
        // window.scrollTo(0, window.scrollY - 120);  
      } else {
        scrollContext.onScrollFinished();
      }
    } else {
      const delta = index - renderInfo.overscanStartIndex;
      const deltaY = delta * ELEMENT_DEFAULT_HEIGHT;
      window.scrollTo(0, window.scrollY + deltaY);
    }
  }

  useEffect(() => {
    if (scrollContext.scrollHash && /^#content-/.test(scrollContext.scrollHash)) {
      scrollToHash(scrollContext.scrollHash, renderInfoRef.current)
    }
  }, [scrollContext.scrollHash])

  const handleRowsRendered = (info) => {
    setBeginIndex(info.overscanStartIndex);
    renderInfoRef.current = info;
    logging.debug('handleRowsRendered', scrollContext);
    if (scrollContext.scrollHash && /^#content-/.test(scrollContext.scrollHash)) {
      scrollToHash(scrollContext.scrollHash, info);
    } else {
      // scrollContext.updateRenderInfo(info);
      const activeHash = getActiveHash(outline, info);
      scrollContext.setActiveHash(activeHash);
    }
  }

  // 当切换其他章节时，这个方法可以确保页面不会跳动，但是在上下滚动时会出现跳动。需要检测滚动方向，确定优先渲染当组件
  if (!props.isActive) {
    const height = domRef.current ? domRef.current.clientHeight : '100%';
    const style = { height }
    return (
      <div 
        className="dz-BlockSectionContainer dz-BlockSectionContainer_placeholder" 
        style={style}
        ref={domRef}
      />
    )
  } 
  // https://github.com/bvaughn/react-virtualized/issues/1324 使用这个方法还是会出现页面跳动

  return (
    <WindowScroller
      key={node.id}
    >
      {({ height, isScrolling, onChildScroll, scrollTop, registerChild }) => (
        <div
          ref={(el) => {
            domRef.current = el;
            registerChild(el);
          }} 
          className={classNames("dz-BlockSectionContainer", props.className)} 
          style={{ left: -1 * PARA_NUM_OFFSET, position: 'relative'}}
        >
          <List
            autoHeight
            height={height}
            isScrolling={isScrolling}
            onScroll={onChildScroll}
            rowCount={blockSections.length}
            rowHeight={cacheRef.current.rowHeight}
            scrollTop={scrollTop}
            width={width + PARA_NUM_OFFSET}
            onRowsRendered={handleRowsRendered}
            tabIndex={-1}
            style={{ counterReset: `para ${Math.max(beginIndex)}` }}
            rowRenderer={({ index, key, parent, style }) => {
              let blockStyle;
              if (inDropzone) {
                if (dropPivotIndex !== undefined && index > dropPivotIndex) {
                  blockStyle = {
                    ...style,
                    transition: `transform ${TRANSITION_DURATION}ms ease`,
                    transform: `translate3d(0px, ${DROP_REGION_HEIGHT}px, 0px)`,
                    paddingLeft: PARA_NUM_OFFSET,
                  } 
                } else {
                  blockStyle = {
                    ...style,
                    transition: `transform ${TRANSITION_DURATION}ms ease`,
                    paddingLeft: PARA_NUM_OFFSET,
                  }
                }
              } else {
                blockStyle = {
                  ...style,
                  paddingLeft: PARA_NUM_OFFSET,
                }
              }
              const { component: Compo, props: compoProps } = blockSections[index];
              return (
                <CellMeasurer
                  cache={cacheRef.current}
                  columnIndex={0}
                  key={key}
                  parent={parent}
                  rowIndex={index}
                >
                  {(cellMeasure) => 
                    <MeasureContext.Provider value={cellMeasure}>
                      <div className="dz-BlockSectionWrap" style={blockStyle}>
                        <Compo 
                          {...compoProps}
                        />
                      </div>
                    </MeasureContext.Provider>
                  }
                </CellMeasurer>
              )
            }}
          />
          {inDropzone && <DropHint left={PARA_NUM_OFFSET} top={getTop()} height={2} />}
        </div>
      )}
    </WindowScroller>
  )
}

NodeContent.propTypes = {
  className: PropTypes.string,
  isActive: PropTypes.bool,
}

NodeContent.defaultProps = {
  isActive: true,
}

export default NodeContent;