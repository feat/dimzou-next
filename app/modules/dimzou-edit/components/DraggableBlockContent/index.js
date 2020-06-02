import React from 'react';
import PropTypes from 'prop-types';

import ReactDOM from 'react-dom';
import { DragSource } from 'react-dnd';

import { formatMessage } from '@/services/intl';

import Modal from '@feat/feat-ui/lib/modal';
import RewordingPreviewWidget from '../RewordingPreviewWidget';
import { extractWidgetInfo } from '../../utils/rewordings';
import { alert as alertMessages } from '../../messages';
import { DRAGGABLE_TYPE_BLOCK } from '../../constants';

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
  endDrag(props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }
    const box = component.dom.getBoundingClientRect();
    const sourceClientOffset = monitor.getSourceClientOffset();
    if (
      sourceClientOffset && (
        sourceClientOffset.x > box.right ||
        sourceClientOffset.x < box.left - box.width ||
        sourceClientOffset.y > box.bottom ||
        sourceClientOffset.y < box.top - box.top
      )
    ) {
      Modal.confirm({
        title: formatMessage(alertMessages.confirmLabel),
        content: formatMessage(alertMessages.removeBlockConfirm),
        onConfirm: () => {
          props.onRemove(props.rewording);
        },
        onCancel: () => {},
      });
    }
  },
};

const sourceCollect = (collect, monitor) => ({
  connectDragSource: collect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DragSource(
  DRAGGABLE_TYPE_BLOCK,
  rewordingSource,
  sourceCollect,
)(DraggableBlockContent);
