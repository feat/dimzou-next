import React from 'react';
import { DragSource } from 'react-dnd';
import classNames from 'classnames';
import { 
  addEventListenerFor,
  removeEventListenerFor,
} from '@/services/dnd/helpers';

const withDrag = DragSource(
  'EXP_NODE',
  {
    beginDrag: (props) => {
      const container = document.querySelector('.dz-DraftsPanel__content');
      if (container) {
        addEventListenerFor(container);
      }
      return {
        type: props.type,
        data: props.data,
        bundleId: props.bundleId,
        index: props.index,
      }
    },
    canDrag: (props) => !props.disabled,
    endDrag: () => {
      const container = document.querySelector('.dz-DraftsPanel__content');
      if (container) {
        removeEventListenerFor(container);
      }
    },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)


function NodeLabel(props) {
  const { connectDragSource, connectDragPreview, extra, type, className, name, subTitle } = props;
  return connectDragSource(
    <div 
      className={classNames(`dz-DraftsNodeLabel dz-DraftsNodeLabel_${type}`, className)}
      onClick={props.onClick}
    >
      {connectDragPreview(<div className='dz-DraftsNodeLabel__text'>{name}</div>)}
      {subTitle && <div className='dz-DraftsNodeLabel__sub'>{subTitle}</div>}
      <div className="dz-DraftsNodeLabel__extra">
        {extra}
      </div>
    </div>
  );
}

const DraggableNodeLabel = withDrag(NodeLabel);

export default DraggableNodeLabel;