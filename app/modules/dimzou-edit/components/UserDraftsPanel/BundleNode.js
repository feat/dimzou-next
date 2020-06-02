import { useState, useMemo, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import Router from 'next/router';

import { dimzouBundleDesc as dimzouBundleDescSchema } from '@/schema';
import { formatMessage } from '@/services/intl';

// import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import Popover from '@feat/feat-ui/lib/popover';
import Modal from '@feat/feat-ui/lib/modal';

import Node from './Node';
import NodeDropzone from './NodeDropzone';
import DraggableNodeLabel from './DraggableNodeLabel';
import NodeOutline from '../NodeOutline';
import PopMenu from '../PopMenu';
import ScrollButton from '../ScrollButton';
import RoleIcon from '../RoleIcon';

import { NODE_TYPE_CHAPTER, BUNDLE_STATUS_PUBLISHED } from '../../constants';

import { getVersionLabel } from '../../utils/bundle';
import { WorkspaceContext, ScrollContext } from '../../context'
// import pageAddIcon from '../../assets/icon-page-add.svg';
import pageIcon from '../../assets/icon-page.svg';
import pagePublishedIcon from '../../assets/icon-page-published.svg';
import bookCollapsed from '../../assets/icon-book-collapsed.svg';
import bookExpanded from '../../assets/icon-book-expanded.svg';
import bookIcon from '../../assets/icon-book.svg';
import menuIcon from '../../assets/icon-menu.svg';

import { 
  asyncMergeBundle, 
  asyncSeparateNode, 
  updateNodeSort, 
  // initCreateChapter, 
  // exitCreateChapter, 
  asyncDeleteBundle, 
} from '../../actions';

import intlMessages from '../../messages'
import { getUserRole } from '../../utils/collaborators';
import { getAsPath } from '../../utils/router';

export default function BundleNode(props) {
  const { data, currentUser, index, type } = props;
  const popRef = useRef(null);
  const dispatch = useDispatch();
  const workspace = useContext(WorkspaceContext);
  const scrollContext = useContext(ScrollContext);
  const isPublication = type === 'publication';
  const isCurrent = workspace.bundleId === String(data.id) && (
    workspace.isPublicationView === isPublication
  );
  const [ expanded, setExpanded ] = useState(isCurrent);

  useEffect(() => {
    if (isCurrent && !expanded) {
      setExpanded(true);
    }
  }, [isCurrent])
  const firstNode = data.nodes[0];
  const chapterNodes = useMemo(() => data.nodes.filter((item) => item.node_type === NODE_TYPE_CHAPTER), [data.nodes]);
  const handleDrop = (source, place) => {
    if (place.position === 'inner') {
      dispatch(asyncMergeBundle({
        bundleId: place.bundleId,
        sourceBundleId: source.bundleId,
      }))
    } else {
      dispatch(asyncSeparateNode({
        bundleId: source.bundleId,
        nodeId: source.data.id,
        place,
      }))
    }
  }
  const handleNodeSort = (source, place) => {
    const { index: pivotIndex } = place;
    const { index: dragIndex } = source;
    let targetIndex;
    if (dragIndex > pivotIndex) {
      targetIndex = place.position === 'after' ? pivotIndex + 1 : pivotIndex;
    } else if (dragIndex === pivotIndex) {
      return;
    } else {
      targetIndex = place.position === 'after' ? pivotIndex : pivotIndex - 1;
    }
    if (targetIndex === dragIndex) {
      return;
    }
    const { nodes } = props.data;
    const draged = nodes[dragIndex];
    const poped = [
      ...nodes.slice(0, dragIndex),
      ...nodes.slice(dragIndex+1),
    ]
    const updated = [
      ...poped.slice(0, targetIndex),
      draged,
      ...poped.slice(targetIndex),
    ];
    dispatch(updateNodeSort({
      bundleId: data.id,
      patch: {
        nodeId: draged.id,
        sort: targetIndex,
      },
      nodes,
      entityMutators: [
        {
          [dimzouBundleDescSchema.key]: {
            [data.id]: {
              nodes: {
                $set: updated.map((node) => node.id),
              },
            },
          },
        },
      ],
    }))
  }
  
  const isMulti = data.is_multi_chapter;
  const toggleExpanded = () => setExpanded(!expanded);
  const versionLabel = getVersionLabel(data);
  const isPublished = data.status === BUNDLE_STATUS_PUBLISHED;
  const isOwner = data.user ? data.user.uid === currentUser.uid : data.user_id === currentUser.uid;
  
  let role
  if (props.showRoleOfUser) {
    const node = data.nodes[0];
    role = getUserRole(props.showRoleOfUser, node.collaborators);
  }

  let extra = null;
  if (isOwner) {
    extra = (
      <Popover
        placement="bottomRight"
        wrapWithDefaultLayer={false}
        ref={popRef}
        content={
          <PopMenu>
            <PopMenu.Item
              onClick={() => {
                Modal.confirm({
                  title: formatMessage(intlMessages.confirmToDeleteBundle),
                  onConfirm: () => {
                    dispatch(asyncDeleteBundle({
                      bundleId: data.id,
                      userId: data.user ? data.user.uid : data.user_id,
                    })).then(() => {
                      Router.replace({
                        pathname: '/dimzou-edit',
                        query: {
                          isCreate: true,
                        },
                      }, `/draft/new`);
                    })
                  },
                  onCancel: () => {},
                })
                if (popRef.current) {
                  popRef.current.closePortal();
                }
              }}
            >
              {formatMessage(intlMessages.deleteBundle)}
            </PopMenu.Item>
          </PopMenu>
        }
      >
        <IconButton
          dangerouslySetInnerHTML={{ __html: menuIcon }}
        />
      </Popover>
    )
  }

  const href = {
    pathname: '/dimzou-edit',
    query: {
      bundleId: data.id,
      nodeId: data.nodes && data.nodes[0] ? data.nodes && data.nodes[0].id : undefined,
      isPublicationView: isPublication,
    },
  }
  const linkInfo = {
    href,
    as: getAsPath(href),
  }
  
  const displayTitle = versionLabel ? `${data.title} ${versionLabel}` : data.title;
  let icon;
  if (isMulti) {
    if (data.nodes.length === 1) {
      icon = bookIcon;
    } else if (expanded) {
      icon = bookExpanded
    } else {
      icon = bookCollapsed
    }
  } else {
    icon = isPublished ? pagePublishedIcon : pageIcon;
  }
  return (
    <div
      className={classNames("dz-DraftsPanelNode dz-DraftsPanelNode_bundle", {
        'is-current': isCurrent,
        'is-expanded': expanded,
      })}
    >
      <NodeDropzone type="bundle" bundleId={data.id} index={index} position="before" handleDrop={handleDrop} />
      <NodeDropzone type="bundle" bundleId={data.id} position="inner" disabled={!isMulti || isPublished || !isOwner} handleDrop={handleDrop} >
        <div
          className={classNames("dz-DraftsPanelNode__inner")}>
          {isMulti ? (
            <button 
              className='dz-DraftsPanelNode__toggle'
              type="button" 
              onClick={toggleExpanded}
              dangerouslySetInnerHTML={{ __html: icon }} 
            />   
          ) : (
            <span className='dz-DraftsPanelNode__icon' dangerouslySetInnerHTML={{ __html: icon }} />
          )}
          <DraggableNodeLabel
            type="bundle" 
            bundleId={data.id} 
            className={isCurrent ? 'is-current': undefined}
            data={data} 
            disabled={isMulti || !isOwner} 
            name={
              <ScrollButton 
                offset={-120} 
                spy={isCurrent}
                className={classNames({
                  'is-active': isCurrent && String(workspace.nodeId) === String(firstNode.id) && !scrollContext.activeHash,
                })}
                to={`node-${firstNode.id}`} 
                title={displayTitle}
                onClick={() => {
                  Router.push(linkInfo.href, linkInfo.as)
                    .then(() => {
                      window.scrollTo(0, 0);
                    })
                  scrollContext.setActiveHash('');
                }}
                data-node-level='bundle'
                data-is-multi-chapter={isMulti}
                data-is-expanded={expanded}
                onSetActive={(to) => {
                  const nodeId = to.replace('node-', '');
                  if (String(workspace.nodeId) !== nodeId) {
                    Router.replace(linkInfo.href, linkInfo.as)
                  }
                }}
              >
                {data.title}
                {versionLabel && (
                  <span style={{ marginLeft: '.5em'}}>{versionLabel}</span>
                )}
              </ScrollButton>
            }
            subTitle={role !== false && <RoleIcon role={role} />}
            extra={isCurrent && extra}
          />
          {!isMulti && isCurrent && (
            <NodeOutline />
          )}
          {expanded && isMulti && (
            <div>
              { chapterNodes.map((item, index) => (
                <Node 
                  type={props.type}
                  bundleId={data.id}
                  data={item}
                  currentUser={currentUser}
                  index={index + 1}
                  key={item.id}
                  onSort={handleNodeSort}
                  showRoleOfUser={props.showRoleOfUser}
                />
              ))}
            </div>
          )}
        </div>
      </NodeDropzone>
      <NodeDropzone type="bundle" bundleId={data.id} index={index} position="after" handleDrop={handleDrop} />
    </div>
  )
}

BundleNode.propTypes = {
  data: PropTypes.object,
  index: PropTypes.number,
  currentUser: PropTypes.object,
  showRoleOfUser:  PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  type: PropTypes.oneOf([
    'publication',
    'draft',
  ]),
}

BundleNode.defaultProps = {
  type: 'draft',
}