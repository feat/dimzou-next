import React from 'react';
import { DragSource } from 'react-dnd';

const DragBox = ({
  hideSourceOnDrag,
  connectDragSource,
  right,
  bottom,
  isDragging,
  children,
}) => {
  if (isDragging && hideSourceOnDrag) {
    return null;
  }
  return connectDragSource(
    <div style={{ right, bottom }} className="comment__DragBox">
      {children}
    </div>,
  );
};

export default DragSource(
  'comment',
  {
    beginDrag(props) {
      const { right, bottom } = props;
      const dropBoard = document.querySelector('.comment__DropBoard');
      dropBoard.style.pointerEvents = 'auto';
      return { right, bottom };
    },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
)(DragBox);
