/**
 * 资源拖放容器，仅需处理 深度 大于 当前深度的 item
 */
import React from 'react';
import PropTypes from 'prop-types';

import { useDrop } from 'react-dnd';

import classNames from 'classnames';
import { DRAGGABLE_RESOURCE_NODE } from '../../constants';
import styles from './index.module.scss';

// 注意区别： 需要捕捉 与 需要处理

function ContainerDropzone(props) {
  const [collected, drop] = useDrop({
    accept: DRAGGABLE_RESOURCE_NODE,
    canDrop: () => !!props.onDrop,
    drop(item, monitor) {
      if (!monitor.didDrop()) {
        if (props.canDrop(item)) {
          props.onDrop(item);
        } else {
          logging.debug('capture');
        }
      }
    },
    collect: (monitor) => ({
      isShallowOver: monitor.isOver({ shallow: true }),
      item: monitor.getItem(),
    }),
  });

  const isActive = collected.isShallowOver && props.canDrop(collected.item);

  return (
    <div
      ref={drop}
      className={classNames(styles.dropzone, {
        [styles.isDropActive]: isActive,
      })}
    >
      {props.children}
    </div>
  );
}

ContainerDropzone.propTypes = {
  canDrop: PropTypes.func.isRequired,
  children: PropTypes.any,
  onDrop: PropTypes.func,
};

export default ContainerDropzone;
