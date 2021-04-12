import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

import { DropTarget, DragSource } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

import Modal from '@feat/feat-ui/lib/modal';

import message from '@feat/feat-ui/lib/message';
import ActionButton from '@/components/ActionButton';
import Lightbox from '@/components/Lightbox';
import {
  REWORDING_STATUS_PENDING,
  DRAGGABLE_TYPE_REWORDING,
  DRAG_TO_DELETE_DELTA,
} from '../../constants';
import intlMessages, { alert as alertMessages } from '../../messages';

class ImageRewording extends React.PureComponent {
  state = {
    shouldDisplayElectButton: false,
    showLightBox: false,
  };

  blockRef = (n) => {
    this.dom = n;
    this.props.connectDropTarget(this.dom);
    if (this.props.canDrag) {
      this.props.connectDragSource(this.dom);
    }
  };

  initReselect = () => {
    if (this.props.canElect) {
      this.setState({
        shouldDisplayElectButton: true,
      });
    }
  };

  cancelReselect = () => {
    this.setState({
      shouldDisplayElectButton: false,
    });
  };

  handleClick = () => {
    const { data } = this.props;
    if (
      data.is_origin ||
      data.is_selected ||
      data.status === REWORDING_STATUS_PENDING
    ) {
      this.setState({
        showLightBox: true,
      });
      // message.info({
      //   content: formatMessage(intlMessages.imageRewordMethodHint),
      // });
    } else {
      this.initReselect();
    }
  };

  render() {
    const {
      data,
      className,
      isSubmittingFile,
      fileSubmitting,
      isOver,
      intl: { formatMessage },
    } = this.props;
    let contentProps;
    if (isSubmittingFile && fileSubmitting) {
      contentProps = {
        children: (
          <figure style={{ margin: 0 }}>
            <img key="preview" src={fileSubmitting.preview} alt="preview" />
          </figure>
        ),
      };
    } else if (data.img) {
      contentProps = {
        children: (
          <figure style={{ margin: 0 }}>
            <img
              key={data.id}
              src={data.img}
              width={data.img_width}
              height={data.img_height}
              alt={data.id}
            />
          </figure>
        ),
      };
    } else {
      contentProps = {
        dangerouslySetInnerHTML: {
          __html: data.html_content,
        },
      };
    }

    return (
      <div
        ref={this.blockRef}
        className={classNames(
          'dz-RewordingWidget dz-RewordingDropzone',
          className,
          {
            'is-submitting': isSubmittingFile,
            'is-over': isOver,
          },
        )}
      >
        <div className="dz-Typo" {...contentProps} onClick={this.handleClick} />
        {this.state.shouldDisplayElectButton && (
          <div className="dz-RewordingWidgetOverlay">
            <div className="dz-RewordingWidgetOverlay__inner">
              <div className="dz-RewordingWidgetOverlay__message">
                {formatMessage(alertMessages.reselectConfirm)}
              </div>
              <div className="dz-RewordingWidgetOverlay__footer">
                <ActionButton type="no" onClick={this.cancelReselect} />
                <ActionButton
                  className="margin_l_12"
                  type="ok"
                  onClick={this.props.onElect}
                />
              </div>
            </div>
          </div>
        )}
        {this.state.showLightBox && (
          <Lightbox
            mainSrc={fileSubmitting ? fileSubmitting.preivew : data.img}
            onCloseRequest={() => {
              this.setState({
                showLightBox: false,
              });
            }}
          />
        )}
      </div>
    );
  }
}

ImageRewording.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
  connectDropTarget: PropTypes.func,
  onDrop: PropTypes.func.isRequired,
  isSubmittingFile: PropTypes.bool,
  fileSubmitting: PropTypes.object,
  canElect: PropTypes.bool,
  onElect: PropTypes.func,
  isOver: PropTypes.bool,
  canDrag: PropTypes.bool,

  intl: PropTypes.object,
};

ImageRewording.defaultProps = {
  canDrag: true,
};

const mediaTarget = {
  canDrop(props) {
    return !props.isSubmittingFile;
  },
  drop(props, monitor) {
    const { files } = monitor.getItem();
    const {
      intl: { formatMessage },
    } = props;
    if (files.length) {
      props.onDrop({
        files,
        rewording: props.data,
        trigger: props.renderLevel,
      });
    } else {
      message.info(formatMessage(intlMessages.imageRewordMethodHint));
    }
  },
};

const targetCollect = (collect, monitor) => ({
  connectDropTarget: collect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
});

const withDropTarget = DropTarget(NativeTypes.FILE, mediaTarget, targetCollect);

const rewordingSource = {
  beginDrag(props) {
    return {
      type: DRAGGABLE_TYPE_REWORDING,
      payload: {
        rewording: props.data,
      },
    };
  },
  canDrag(props) {
    if (props.isSubmittingFile) {
      return false;
    }
    return (
      !props.data.version_lock && props.data.user.uid === props.currentUser.uid
    );
  },
  endDrag(props, monitor) {
    if (monitor.didDrop()) {
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
        props.onRemove(props.data);
      },
      onCancel: () => {},
    });
  },
};

const sourceCollect = (collect, monitor) => ({
  connectDragSource: collect.dragSource(),
  isDragging: monitor.isDragging(),
});

const withDragSource = DragSource(
  DRAGGABLE_TYPE_REWORDING,
  rewordingSource,
  sourceCollect,
);

export default compose(
  injectIntl,
  withDropTarget,
  withDragSource,
)(ImageRewording);
