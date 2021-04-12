import { useDrop } from 'react-dnd';
import PropTypes from 'prop-types';

import { DRAGGABLE_RESOURCE_NODE } from '../../constants';
import styles from './index.module.scss';

import { useListDropzone } from './hooks';
import { ListDropzoneContext } from './context';

function NodeListDropzone(props) {
  const [collected, drop] = useDrop({
    accept: DRAGGABLE_RESOURCE_NODE,
    drop(item) {
      props.onDrop(item, pivotIndex);
    },
    canDrop: props.canDrop,
    collect: (monitor) => ({
      isActive: monitor.isOver({ shallow: true }) && monitor.canDrop(),
    }),
  });

  const [pivotIndex, domRef] = useListDropzone(
    `.${styles.node}`,
    collected.isActive,
  );

  drop(domRef);
  return (
    <ListDropzoneContext.Provider
      value={{ isActive: collected.isActive, pivotIndex }}
    >
      {props.children({
        domRef,
        isActive: collected.isActive,
        pivotIndex,
      })}
    </ListDropzoneContext.Provider>
  );
}

NodeListDropzone.propTypes = {
  canDrop: PropTypes.func,
  onDrop: PropTypes.func.isRequired,
  children: PropTypes.func,
};

export default NodeListDropzone;
