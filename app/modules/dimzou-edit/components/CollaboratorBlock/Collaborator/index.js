import PropTypes from 'prop-types';

import { useDrag } from 'react-dnd';
import { useIntl } from 'react-intl';
import Modal from '@feat/feat-ui/lib/modal';

import Collaborator from '../../Collaborator';

import { DRAGGABLE_TYPE_COLLABORATOR } from '../../../constants';
import { alert as alertMessages } from '../../../messages';

function DraggableCollaborator(props) {
  const { collaborator, nodeWords, disabled } = props;
  const { formatMessage } = useIntl();
  const [{ isDragging }, drag, dragPreview] = useDrag({
    item: {
      type: DRAGGABLE_TYPE_COLLABORATOR,
      payload: {
        collaborator,
      },
    },
    canDrag: !disabled,
    end(_, monitor) {
      if (monitor.didDrop()) {
        return;
      }
      if (props.collaborator.is_deleted) {
        return;
      }
      if (!props.canRemove) {
        return;
      }
      const offset = monitor.getDifferenceFromInitialOffset();
      if (Math.abs(offset.x) > 200 || Math.abs(offset.y) > 50) {
        Modal.confirm({
          title: formatMessage(alertMessages.confirmLabel),
          content: formatMessage(alertMessages.removeCollaborator),
          onConfirm: () => {
            props.onRemove(props.collaborator);
          },
          onCancel: () => {},
        });
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Collaborator
      ref={drag}
      dragPreview={dragPreview}
      data={collaborator}
      nodeWords={nodeWords}
      isDragging={isDragging}
    />
  );
}

DraggableCollaborator.propTypes = {
  collaborator: PropTypes.object,
  nodeWords: PropTypes.number,
  disabled: PropTypes.bool,
  canRemove: PropTypes.bool,
  onRemove: PropTypes.func,
};

export default DraggableCollaborator;
