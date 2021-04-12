import React from 'react';
import PropTypes from 'prop-types';

import ReactDOM from 'react-dom';
import { DragSource } from 'react-dnd';

import Modal from '@feat/feat-ui/lib/modal';
import { injectIntl } from 'react-intl';
import RewordingPreviewWidget from '../RewordingPreviewWidget';
import { extractWidgetInfo } from '../../utils/rewordings';
import { alert as alertMessages } from '../../messages';
import { DRAGGABLE_TYPE_BLOCK, DRAG_TO_DELETE_DELTA } from '../../constants';

class DraggableBlockContent extends React.PureComponent {
  blockRef = (n) => {
    this.dom = ReactDOM.findDOMNode(n);
    if (!this.props.disabled) {
      this.props.connectDragSource(this.dom);
    }
  };

  render() {
    const {
      className,
      onClick,
      rewording,
      onDrop,
      renderLevel,
      isSubmittingFile,
      fileSubmitting,
      contentSuffix,
    } = this.props;
    this.widgetInfo = extractWidgetInfo(rewording);
    return (
      <RewordingPreviewWidget
        ref={this.blockRef}
        className={className}
        data={rewording}
        onClick={onClick}
        onDrop={onDrop}
        renderLevel={renderLevel}
        isSubmittingFile={isSubmittingFile}
        fileSubmitting={fileSubmitting}
        contentSuffix={contentSuffix}
        canDrag={false}
      />
    );
  }
}

DraggableBlockContent.propTypes = {
  connectDragSource: PropTypes.func,
  // isDragging: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onDrop: PropTypes.func,
  rewording: PropTypes.object,
  disabled: PropTypes.bool,
  renderLevel: PropTypes.string,
  isSubmittingFile: PropTypes.bool,
  fileSubmitting: PropTypes.object,
  contentSuffix: PropTypes.any,
};

const rewordingSource = {
  beginDrag(props) {
    logging.debug('begin drag block content');
    return {
      type: DRAGGABLE_TYPE_BLOCK,
      payload: {
        rewording: props.rewording,
        sort: props.sort,
        blockId: props.blockId,
      },
    };
  },
  canDrag(props) {
    return !props.disabled;
  },
  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      return;
    }
    if (!props.rewording.img && !props.rewording.content) {
      return;
    }
    const difference = monitor.getDifferenceFromInitialOffset();
    if (
      Math.abs(difference.x) < DRAG_TO_DELETE_DELTA &&
      Math.abs(difference.y) < DRAG_TO_DELETE_DELTA
    ) {
      return;
    }
    const {
      intl: { formatMessage },
    } = props;

    Modal.confirm({
      title: formatMessage(alertMessages.confirmLabel),
      content: formatMessage(alertMessages.removeBlockConfirm),
      onConfirm: () => {
        props.onRemove(props.rewording);
      },
      onCancel: () => {},
    });
  },
};

const sourceCollect = (collect, monitor) => ({
  connectDragSource: collect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default injectIntl(
  DragSource(DRAGGABLE_TYPE_BLOCK, rewordingSource, sourceCollect)(
    DraggableBlockContent,
  ),
  { forwardRef: true },
);
