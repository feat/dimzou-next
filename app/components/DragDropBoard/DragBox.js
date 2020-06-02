import React from 'react';
import { DragSource } from 'react-dnd';

const DragBox = ({
  hideSourceOnDrag,
  connectDragSource,
  // right,
  bottom,
  left,
  // top,
  isDragging,
  children,
}) => {
  if (isDragging && hideSourceOnDrag) {
    return null;
  }
  return connectDragSource(
    <div
      // style={{ right, bottom }}
      style={{ left, bottom }}
      className="dd-DragBox"
    >
      {children}
    </div>,
  );
};

export default DragSource(
  'dd',
  {
    beginDrag(props) {
      const { bottom, left } = props;
      const dropBoard = document.querySelector('.dd-DropBoard');
      dropBoard.style.pointerEvents = 'auto';
      // return { right, bottom };
      return { left, bottom };
    },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
)(DragBox);
