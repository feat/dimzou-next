import { useState, useMemo, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useDrag, useDrop } from 'react-dnd';

// import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';
import Modal from '@feat/feat-ui/lib/modal';
import { dimzouBundleDesc as dimzouBundleDescSchema } from '../../schema';

// import RoleIcon from '../RoleIcon';
import Node from './Node';
import NodeOutline from './NodeOutline';
import PublicationOutline from './PublicationOutline';
import { Element as TElement, ListDropzone, Node as TNode } from '../Explorer';

import {
  NODE_TYPE_CHAPTER,
  BUNDLE_STATUS_PUBLISHED,
  DRAGGABLE_RESOURCE_NODE,
  ROLE_OWNER,
  ROLE_ADMIN,
  ROLE_PARTICIPATOR,
} from '../../constants';

import { getVersionLabel } from '../../utils/bundle';
import { AppContext, ScrollContext } from '../../context';

import {
  asyncMergeBundle,
  updateNodeSort,
  // initCreateChapter,
  // exitCreateChapter,
  asyncDeleteBundle,
} from '../../actions';

import intlMessages from '../../messages';
import { getUserRole } from '../../utils/collaborators';
import { getAsPath } from '../../utils/router';

import Icon from '../Icon';
function BundleNode(props) {
  const { data, currentUser, type } = props;
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const appState = useContext(AppContext);
  const scrollContext = useContext(ScrollContext);
  const router = useRouter();
  const isPublication = type === 'publication';
  const isCurrent =
    appState.bundleId === String(data.id) &&
    ((appState.pageName === 'view' && type === 'publication') ||
      (appState.pageName === 'draft' && type === 'draft')); // TO_ENHANCE: update route type
  const [expanded, setExpanded] = useState(props.expanded);

  useEffect(
    () => {
      props.cacheExpanded && props.cacheExpanded(expanded);
    },
    [expanded],
  );

  useEffect(
    () => {
      if (isCurrent && !expanded) {
        setExpanded(true);
      }
    },
    [isCurrent],
  );
  const firstNode = data.nodes[0];
  const chapterNodes = useMemo(
    () => data.nodes.filter((item) => item.node_type === NODE_TYPE_CHAPTER),
    [data.nodes],
  );
  const isMulti = data.is_multi_chapter;
  const toggleExpanded = () => setExpanded(!expanded);
  const versionLabel = getVersionLabel(data);
  const isPublished = data.status === BUNDLE_STATUS_PUBLISHED;
  const isOwner = data.user
    ? data.user.uid === currentUser.uid
    : data.user_id === currentUser.uid;

  let role;
  if (props.showRoleOfUser) {
    const node = data.nodes[0];
    role = getUserRole(props.showRoleOfUser, node.collaborators);
  }

  let actions = null;
  if (isOwner) {
    actions = (
      <ButtonBase
        style={{ padding: 3 }}
        onClick={() => {
          Modal.confirm({
            title: formatMessage(intlMessages.confirmToDeleteBundle),
            onConfirm: () => {
              dispatch(
                asyncDeleteBundle({
                  bundleId: data.id,
                  userId: data.user ? data.user.uid : data.user_id,
                }),
              ).then(() => {
                const route = {
                  pathname: '/dimzou-edit',
                  query: {
                    pageName: 'create',
                  },
                };
                router.replace(route, getAsPath(route));
              });
            },
            onCancel: () => {},
          });
        }}
      >
        <Icon name="trash" className="size_20" />
      </ButtonBase>
    );
  }

  const href = {
    pathname: '/dimzou-edit',
    query: {
      pageName: isPublication ? 'view' : 'draft',
      bundleId: data.id,
      nodeId:
        data.nodes && data.nodes[0]
          ? data.nodes && data.nodes[0].id
          : undefined,
    },
  };
  const linkInfo = {
    href,
    as: getAsPath(href),
  };

  const displayTitle = versionLabel
    ? `${data.title} ${versionLabel}`
    : data.title;

  let icon;
  if (isMulti) {
    if (data.nodes.length === 1) {
      icon = 'book';
    } else if (expanded) {
      icon = 'bookOpened';
    } else {
      icon = 'bookHasContent';
    }
  } else {
    switch (role) {
      case ROLE_OWNER:
        icon = 'roleOwner';
        break;
      case ROLE_ADMIN:
        icon = 'roleAdmin';
        break;
      case ROLE_PARTICIPATOR:
        icon = 'roleParticipator';
        break;
      default:
        icon = null;
    }
  }

  const canDnd = isOwner && !isPublished;

  const [, drag] = useDrag({
    item: {
      type: DRAGGABLE_RESOURCE_NODE,
      payload: {
        type: 'bundle',
        bundleId: data.id,
      },
    },
    canDrag: () => canDnd && !isMulti,
  });

  // 处理章节合并
  const [{ isShallowOver, item: dragItem }, drop] = useDrop({
    accept: DRAGGABLE_RESOURCE_NODE,
    canDrop: (item) => canDnd && isMulti && item.payload?.type === 'bundle',
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        dispatch(
          asyncMergeBundle({
            bundleId: data.id,
            sourceBundleId: item.payload.bundleId,
          }),
        );
      }
    },
    collect: (monitor) => ({
      isShallowOver: monitor.isOver({ shallow: true }) && monitor.canDrop(),
      item: monitor.getItem(),
    }),
  });

  const isDropzoneActive = isShallowOver && dragItem.payload.type === 'bundle';
  return (
    <TElement ref={drop} isDropzoneActive={isDropzoneActive}>
      <Link href={linkInfo.href} as={linkInfo.as} passHref>
        <TNode
          data-type={isMulti ? 'collection' : 'leaf'}
          data-is-expanded={expanded}
          depth={0}
          label={displayTitle}
          icon={icon}
          onToggleExpanded={toggleExpanded}
          active={
            isCurrent &&
            String(appState.nodeId) === String(firstNode.id) &&
            !scrollContext.activeSection
          }
          ref={drag}
          // extra={role !== false && <RoleIcon role={role} />}
          actions={actions}
        />
      </Link>
      {!isMulti &&
        !isPublication &&
        isCurrent && <NodeOutline data={firstNode} href={href} depth={0} />}
      {!isMulti &&
        isPublication &&
        isCurrent && (
          <PublicationOutline
            bundleId={data.id}
            nodeId={firstNode.id}
            depth={0}
          />
        )}
      {expanded &&
        isMulti && (
          <ListDropzone
            canDrop={(item) => canDnd && item.payload.bundleId === data.id}
            onDrop={(item, pivotIndex) => {
              // Update Node Sort.
              const dragIndex = item.payload.index;
              if (dragIndex === pivotIndex || pivotIndex + 1 === dragIndex) {
                return;
              }

              const { nodes } = props.data;
              const pivotNode = nodes[pivotIndex + 1]; // nodes 中包含封面node
              const targetSort = Math.min(
                chapterNodes.length,
                dragIndex < pivotIndex ? pivotNode.sort : pivotNode.sort + 1,
              );
              let updated = [...nodes];
              const [dragedNode] = updated.splice(dragIndex + 1, 1, {
                TMP: true,
              });
              updated.splice(pivotIndex + 1 + 1, 0, dragedNode);
              updated = updated.filter((n) => !n.TMP);

              dispatch(
                updateNodeSort({
                  bundleId: data.id,
                  patch: {
                    nodeId: item.payload.nodeId,
                    sort: targetSort,
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
                }),
              );
            }}
          >
            {({ domRef, isActive, pivotIndex }) => (
              <div ref={domRef}>
                {chapterNodes.map((item, i) => (
                  <Node
                    type={props.type}
                    bundleId={data.id}
                    data={item}
                    currentUser={currentUser}
                    index={i}
                    key={item.id}
                    showRoleOfUser={props.showRoleOfUser}
                    depth={1}
                    isDropzoneActive={isActive}
                    dropPivotIndex={pivotIndex}
                  />
                ))}
              </div>
            )}
          </ListDropzone>
        )}
    </TElement>
  );
}

BundleNode.propTypes = {
  data: PropTypes.object,
  currentUser: PropTypes.object,
  showRoleOfUser: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(['publication', 'draft']),
  expanded: PropTypes.bool,
  cacheExpanded: PropTypes.func,
};

BundleNode.defaultProps = {
  type: 'draft',
};

export default BundleNode;
