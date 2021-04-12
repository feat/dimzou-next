import { useDrag } from 'react-dnd';
import { useCachedState } from '@/utils/hooks';
import { DRAGGABLE_ELEMENT } from './constants';

export function useDraggable({
  initialPosition,
  handleUpdate,
  canDrag,
  cacheKey,
}) {
  const [position, setPosition] = useCachedState(cacheKey, initialPosition);

  const [{ isDragging }, drag, dragPreview] = useDrag({
    item: {
      type: DRAGGABLE_ELEMENT,
    },
    end(_, monitor) {
      const delta =
        monitor.getDifferenceFromInitialOffset() || monitor.getDropResult();
      if (!delta) {
        return;
      }
      setPosition((prePosition) => handleUpdate(prePosition, delta));
    },
    canDrag,
    collect(monitor) {
      return {
        isDragging: monitor.isDragging(),
      };
    },
    options: {
      dropEffect: 'move',
    },
  });

  return [isDragging, position, drag, dragPreview];
}
