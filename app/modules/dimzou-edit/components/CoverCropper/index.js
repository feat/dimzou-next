import React from 'react';
import PropTypes from 'prop-types';
import Cropper from 'cropperjs';
import notification from '@feat/feat-ui/lib/notification';

import ActionButton from '@/components/ActionButton';
import 'cropperjs/dist/cropper.css';

const preventWheel = (e) => {
  e.preventDefault();
  e.stopPropagation();
};
class CoverCropper extends React.Component {
  state = {
    disabled: false,
  };

  componentDidMount() {
    this.initialCrop();
    this.container.addEventListener('wheel', preventWheel);
  }

  componentWillUnmount() {
    this.container.removeEventListener('wheel', preventWheel);
  }

  initialCrop = () => {
    const { data, previewBox } = this.props;
    const cropper = new Cropper(this.img, {
      dragMode: 'move',
      cropBoxMovable: false,
      cropBoxResizable: false,
      toggleDragModeOnDblclick: false,
      autoCrop: true,
      data,
      ready() {
        cropper.setCropBoxData({
          left: previewBox.left,
          height: previewBox.height,
          width: previewBox.width,
          top: previewBox.top,
        });
        if (data) {
          // const { naturalHeight, naturalWidth } = cropper.getCanvasData();
          // const height = (naturalHeight / data.height) * previewBox.height;
          // const width = (naturalWidth / data.width) * previewBox.width;
          // const left = (data.x / naturalWidth) * width * -1 + previewBox.left;
          // const top = (data.y / naturalHeight) * height * -1 + previewBox.top;
          // cropper.setCanvasData({
          //   top,
          //   left,
          //   height,
          //   width,
          // });
          const { naturalHeight, naturalWidth } = cropper.getCanvasData();
          const alphaY = previewBox.height / data.height;
          const alphaX = previewBox.width / data.width;
          const canvasWidth = naturalWidth * alphaX;
          const canvasHeight = naturalHeight * alphaY;
          const deltaX = data.x * alphaX;
          const deltaY = data.y * alphaY;
          const canvasTop = previewBox.top - deltaY;
          const canvasLeft = previewBox.left - deltaX;
          cropper.setCanvasData({
            top: canvasTop,
            left: canvasLeft,
            width: canvasWidth,
            height: canvasHeight,
          });
        } else {
          cropper.setCanvasData({
            top: previewBox.top,
            left: previewBox.left,
            width: previewBox.width,
          });
        }
      },
    });
    this.cropper = cropper;
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  handleConfirm = () => {
    const data = this.cropper.getData();
    const canvas = this.cropper.getCroppedCanvas();
    if (!canvas) {
      notification.error({
        message: 'Error',
        description: 'Failed to get canvas.',
      });
      return;
    }
    const { onConfirm } = this.props;
    canvas.toBlob(
      (croppedImage) => {
        onConfirm({
          data,
          croppedImage,
          preview: canvas.toDataURL(),
        });
      },
      'image/jpeg',
      0.8,
    );
    this.setState({
      disabled: true,
    });
  };

  render() {
    const { sourceImage, previewBox } = this.props;
    return (
      <div
        className="CoverCropper"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100%',
          height: '100vw',
          zIndex: 1230,
          overscrollBehavior: 'contain',
        }}
        ref={(n) => {
          this.container = n;
        }}
      >
        <img
          src={sourceImage}
          alt="cover"
          ref={(n) => {
            this.img = n;
          }}
        />
        <div
          className="CoverCropper__actions"
          style={{
            position: 'fixed',
            top: previewBox.bottom + 16,
            right: `calc(100% - ${previewBox.right}px)`,
          }}
        >
          <ActionButton
            type="no"
            size="sm"
            className="margin_r_24"
            onClick={this.handleCancel}
            disabled={this.state.disabled}
          />
          <ActionButton
            type="ok"
            size="sm"
            className="margin_r_12"
            onClick={this.handleConfirm}
            disabled={this.state.disabled}
          />
        </div>
      </div>
    );
  }
}

CoverCropper.propTypes = {
  previewBox: PropTypes.object,
  data: PropTypes.object,
  sourceImage: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default CoverCropper;
