import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';

import Link from 'next/link'
import { formatMessage } from '@/services/intl';
import Modal from '@feat/feat-ui/lib/modal';

import { getAvatar, getAppLink, getUsername } from '@/utils/user';
import { DRAGGABLE_TYPE_COLLABORATOR } from '@/services/dnd';

import AvatarStamp from '@feat/feat-ui/lib/avatar/AvatarStampII';
import { alert as alertMessages } from '../../../messages';

import './style.scss';
const percentage = (num) => `${(num * 100).toFixed(2)}%`
class Collaborator extends React.Component {
  render() {
    const { collaborator, connectDragSource, isDragging, nodeWords } = this.props;
    const { joined_at: joinedAt, user, is_deleted: isDeleted } = collaborator;
    return connectDragSource(
      <div
        className={classNames('dz-Collaborator', {
          'is-dragging': isDragging,
          'is-pending': !joinedAt,
          'is-archive': isDeleted,
        })}
      >
        <AvatarStamp
          avatar={getAvatar(user, 'md')}
          uiMeta={['expertise']}
          size="xs"
          online={user.is_online}
          username={
            <Link 
              href={{ pathname: '/user-profile', query: {
                userId: user.uid,
              }}}
              as={getAppLink(user)}
            >
              <a>{getUsername(user)}</a>
            </Link>}
          expertise={user.expertise}
        />
        {!!nodeWords && (
          <div className="dz-Collaborator__meta">
            {percentage(collaborator.contributing_words/nodeWords)}
            {' '}
            {collaborator.contributing_words}
          </div>
        )}
      </div>,
    );
  }
}

Collaborator.propTypes = {
  collaborator: PropTypes.object,
  connectDragSource: PropTypes.func,
  isDragging: PropTypes.bool,
  nodeWords: PropTypes.number,
};

const collaboratorSource = {
  beginDrag(props) {
    return {
      type: DRAGGABLE_TYPE_COLLABORATOR,
      payload: {
        collaborator: props.collaborator,
      },
    };
  },
  canDrag(props) {
    if (props.disabled) {
      return false;
    }
    return true;
  },
  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      return;
    }
    if (props.collaborator.is_deleted) {
      return;
    }
    const offset = monitor.getDifferenceFromInitialOffset();
    if (Math.abs(offset.x) > 200 || Math.abs(offset.y) > 50) {
      Modal.confirm({
        title: formatMessage(alertMessages.confirmLabel),
        content: formatMessage(alertMessages.removeCollaborator),
        onConfirm: () => {
          props.onRemove(props.collaborator);
        },
        onCancel: () => {},
      })
    }
  },
};

const sourceCollect = (collect, monitor) => ({
  connectDragSource: collect.dragSource(),
  isDragging: monitor.isDragging(),
});

const DraggableCollaborator = DragSource(
  DRAGGABLE_TYPE_COLLABORATOR,
  collaboratorSource,
  sourceCollect,
)(Collaborator);

export default DraggableCollaborator;
