
import React from 'react';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd'

function Slot({ connectDropTarget, children, position, isOver, canDrop, type }) {
  return connectDropTarget(
    <div
      className={classNames('dz-DraftsPanelNodeDropzone', `dz-DraftsPanelNodeDropzone_${position}`, `dz-DraftsPanelNodeDropzone_${type}`,{
        isOver: canDrop && isOver,
      })}>{children}</div>
  )
}

const withDrop = DropTarget(
  [
    'EXP_NODE', // explorer_node
  ],
  {
    drop(props, monitor) {
      if (monitor.didDrop()) {
        return;
      }
      const item = monitor.getItem();
      props.handleDrop(item, {
        bundleId: props.bundleId,
        nodeId: props.nodeId,
        position: props.position,
        index: props.index,
      })
    },
    canDrop(props, monitor) {
      if (props.disabled) {
        return false;
      }
      const item = monitor.getItem();
      // 拖放章节Node
      if (item.type === 'node') {
        // 调整章节顺序 只能在bundle内的列表中
        if (props.type === 'node') {
          return props.bundleId === item.bundleId && props.nodeId !== item.data.id;
        }
        // 拆分章节
        return props.position !== 'inner';
      }
      // 拖放单章节Bundle
      if (item.type === 'bundle') {
        return props.type === 'bundle' && props.bundleId !== item.bundleId && props.position === 'inner';
      }
      return false;
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
  }),
)

const NodeDropzone = withDrop(Slot);

export default NodeDropzone;