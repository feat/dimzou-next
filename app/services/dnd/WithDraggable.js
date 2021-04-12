import PropTypes from 'prop-types';

import { useDraggable } from './hooks';
function WithDraggable(props) {
  const [isDragging, position, drag] = useDraggable(props);
  return props.children({
    isDragging,
    position,
    drag,
  });
}

WithDraggable.propTypes = {
  children: PropTypes.func,
  initialPosition: PropTypes.object,
  handleUpdate: PropTypes.func,
};

export default WithDraggable;
