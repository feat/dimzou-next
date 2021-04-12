import { useContext } from 'react';
// import Router from 'next/router'
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { useDrag } from 'react-dnd';
import { useIntl } from 'react-intl';

import Modal from '@feat/feat-ui/lib/modal';

import {
  Element as TElement,
  Node as TNode,
  DropHint as TDropHint,
} from '../Explorer';
// import RoleIcon from '../RoleIcon';
import NodeOutline from './NodeOutline';
import PublicationOutline from './PublicationOutline';

import {
  NODE_TYPE_COVER,
  NODE_STATUS_PUBLISHED,
  DRAG_TO_DELETE_DELTA,
  DRAGGABLE_RESOURCE_NODE,
  ROLE_OWNER,
  ROLE_ADMIN,
  ROLE_PARTICIPATOR,
} from '../../constants';
import { getUserRole } from '../../utils/collaborators';
import { getAsPath } from '../../utils/router';
import { AppContext, ScrollContext } from '../../context';
import { asyncSeparateNode } from '../../actions';
import { alert as alertMessages } from '../../messages';
export default function Node(props) {
  const {
    data,
    index,
    bundleId,
    currentUser,
    type,
    depth,
    isDropzoneActive,
    dropPivotIndex,
  } = props;
  const { formatMessage } = useIntl();
  const appState = useContext(AppContext);
  const scrollContext = useContext(ScrollContext);
  const dispatch = useDispatch();
  const isPublication = type === 'publication';
  const isCurrent =
    String(data.id) === appState.nodeId &&
    ((appState.pageName === 'view' && type === 'publication') ||
      (appState.pageName === 'draft' && type === 'draft')); // TO_ENHANCE: update
  const isCoverNode = data.node_type === NODE_TYPE_COVER;
  const isPublished = data.status === NODE_STATUS_PUBLISHED;
  const isOwner = data.user && data.user.uid === currentUser.uid;
  const role =
    props.showRoleOfUser &&
    getUserRole(props.showRoleOfUser, data.collaborators);
  const href = {
    pathname: '/dimzou-edit',
    query: {
      pageName: isPublication ? 'view' : 'draft',
      bundleId,
      nodeId: data.id,
    },
  };
  const asPath = getAsPath(href);
  // const shouldSpy = String(bundleId) === String(workspace.bundleId); // bundle active;
  const isActive = isCurrent && !scrollContext.activeSection;

  const [, drag] = useDrag({
    item: {
      type: DRAGGABLE_RESOURCE_NODE,
      payload: {
        bundleId,
        nodeId: data.id,
        index,
        type: 'node', // dimzou_resource node
      },
    },
    canDrag: isOwner && !isPublished && !isCoverNode,
    collect: (mointor) => ({
      isDragging: mointor.isDragging(),
    }),
    end(item, monitor) {
      const difference = monitor.getDifferenceFromInitialOffset();
      if (
        !monitor.didDrop() &&
        ((difference && Math.abs(difference.x) > DRAG_TO_DELETE_DELTA) ||
          (difference && Math.abs(difference.y) > DRAG_TO_DELETE_DELTA))
      ) {
        Modal.confirm({
          title: formatMessage(alertMessages.confirmLabel),
          content: formatMessage(alertMessages.separateNodeConfirm),
          onConfirm: () => {
            dispatch(
              asyncSeparateNode({
                bundleId: item.payload.bundleId,
                nodeId: item.payload.nodeId,
              }),
            );
          },
          onCancel: () => {},
        });
      }
    },
  });

  const shouldRenderDropHint =
    isDropzoneActive &&
    (dropPivotIndex === index || (dropPivotIndex === -1 && index === 0));

  let icon;
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

  return (
    <TElement>
      <Link href={href} as={asPath} passHref>
        <TNode
          data-type="leaf"
          active={isActive}
          depth={depth}
          icon={icon}
          label={data.text_title}
          // extra={role !== false && <RoleIcon role={role} />}
          ref={drag}
        />
      </Link>
      {type === 'draft' &&
        isCurrent && <NodeOutline data={data} depth={depth} href={href} />}
      {type === 'publication' &&
        isCurrent && <PublicationOutline depth={depth} nodeId={data.id} />}
      {shouldRenderDropHint && (
        <TDropHint
          style={
            dropPivotIndex === -1
              ? {
                  position: 'absolute',
                  top: -1,
                  zIndex: 1,
                }
              : { position: 'absolute', bottom: -1, zIndex: 1 }
          }
        />
      )}
    </TElement>
  );
}

Node.propTypes = {
  data: PropTypes.object,
  currentUser: PropTypes.object,
  index: PropTypes.number,
  bundleId: PropTypes.number,
  showRoleOfUser: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(['publication', 'draft']),
  depth: PropTypes.number,
  isDropzoneActive: PropTypes.bool,
  dropPivotIndex: PropTypes.number,
};
