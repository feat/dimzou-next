
import React from 'react';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd'

function DraftsList({ connectDropTarget, children, isOver, canDrop }) {
  return connectDropTarget(
    <div
      className={classNames('dz-DraftsList', {
        isOver: canDrop && isOver,
      })}>{children}</div>
  )
}

const withDrop = DropTarget(
  [
    'EXP_NODE',
  ],
  {
    drop(props, monitor) {
      if (monitor.didDrop()) {
        return;
      }
      const item = monitor.getItem();
      props.handleDrop(item)
    },
    canDrop(props, monitor) {
      if (props.disabled) {
        return false;
      }
      const item = monitor.getItem();
      return item.type === 'node';
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
  }),
)

const DraftsListDropzone = withDrop(DraftsList);

export default DraftsListDropzone;