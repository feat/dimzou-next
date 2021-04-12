import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd';
import { injectIntl } from 'react-intl';
import Tooltip from '@feat/feat-ui/lib/tooltip';

import {
  DRAGGABLE_TYPE_USER,
  DRAGGABLE_TYPE_USER_CONTACT,
} from '@/services/dnd';

import {
  ACTION_ADD_COLLABORATOR,
  ACTION_UPDATE_COLLABORATOR,
  DRAGGABLE_TYPE_COLLABORATOR,
} from '../../../constants';

import { collaboratorRole } from '../../../messages';

import './style.scss';

class CollaboratorZone extends React.PureComponent {
  render() {
    const {
      children,
      connectDropTarget,
      canDrop,
      isOver,
      level,
      intl: { formatMessage },
    } = this.props;

    const label = formatMessage(collaboratorRole[level]);
    return (
      <div className="dz-CollaboratorDropzone">
        <Tooltip placement="left" title={label}>
          <div className="dz-CollaboratorDropzone__symbol">
            {this.props.icon}
          </div>
        </Tooltip>

        {connectDropTarget(
          <div
            className={classNames('dz-CollaboratorDropzone__inner', {
              'can-drop': canDrop,
              'is-over': canDrop && isOver,
            })}
          >
            {children}
          </div>,
        )}
      </div>
    );
  }
}

CollaboratorZone.propTypes = {
  children: PropTypes.node,
  connectDropTarget: PropTypes.func,
  canDrop: PropTypes.bool,
  isOver: PropTypes.bool,
  disabled: PropTypes.bool, // eslint-disable-line
  level: PropTypes.number.isRequired,
  handleDrop: PropTypes.func, // eslint-disable-line
  icon: PropTypes.node,
  intl: PropTypes.object,
};

const collaboratorTarget = {
  canDrop(props, monitor) {
    if (props.disabled) {
      return false;
    }
    const item = monitor.getItem();
    if (
      item.type === DRAGGABLE_TYPE_COLLABORATOR &&
      item.payload.collaborator.role === props.level &&
      !item.payload.collaborator.is_deleted
    ) {
      return false;
    }
    return (
      (item.type === DRAGGABLE_TYPE_COLLABORATOR &&
        item.payload.collaborator.role !== props.level) ||
      item.type === DRAGGABLE_TYPE_USER ||
      item.type === DRAGGABLE_TYPE_USER_CONTACT
    );
  },
  drop(props, monitor) {
    const item = monitor.getItem();
    switch (item.type) {
      case DRAGGABLE_TYPE_COLLABORATOR:
        props.handleDrop({
          type: ACTION_UPDATE_COLLABORATOR,
          level: props.level,
          collaborator: item.payload.collaborator,
        });
        break;
      case DRAGGABLE_TYPE_USER:
        props.handleDrop({
          type: ACTION_ADD_COLLABORATOR,
          level: props.level,
          userId: item.payload.user_id,
        });
        break;
      case DRAGGABLE_TYPE_USER_CONTACT:
        props.handleDrop({
          type: ACTION_ADD_COLLABORATOR,
          level: props.level,
          userId: item.payload.contact.friend,
        });
        break;
      default:
        logging.warn('Unknown Collaborator type', item);
    }
  },
};

const dropCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType(),
});

const DroppableCollaboratorZone = DropTarget(
  [
    DRAGGABLE_TYPE_COLLABORATOR,
    DRAGGABLE_TYPE_USER,
    DRAGGABLE_TYPE_USER_CONTACT,
  ],
  collaboratorTarget,
  dropCollect,
)(injectIntl(CollaboratorZone, { forwardRef: true }));

export default DroppableCollaboratorZone;
