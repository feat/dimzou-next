import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactCrop from 'react-image-crop';
import { namespace as defaultNamespace } from '../config';

/** Image Crop Panel */
class CropPanel extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    /** percentage value */
    defaultCrop: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
      aspect: PropTypes.number,
      unit: PropTypes.oneOf(['px', '%']),
    }),
    namespace: PropTypes.string,
    className: PropTypes.string,
    cropSize: PropTypes.object,
    createPreview: PropTypes.bool,
    mimeType: PropTypes.oneOf(['image/png', 'image/jpeg']),
    qualityArgument: PropTypes.number,
    onChange: PropTypes.func,
    crossorigin: PropTypes.string,
  };

  static defaultProps = {
    defaultCrop: {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      aspect: 1,
      unit: '%',
    },
    cropSize: {},
    createPreview: true,
    namespace: defaultNamespace,
    mimeType: 'image/jpeg',
    qualityArgument: 0.9,
  };

  constructor(props) {
    super(props);
    this.image = null;
    this.state = {
      crop: {
        ...props.defaultCrop,
        unit: props.defaultCrop.unit || '%',
      },
    };
  }

  getValue() {
    const { crop } = this.state;
    if (this.props.createPreview) {
      return this.cropImage().then((preview) => ({
        crop,
        preview,
      }));
    }
    return Promise.resolve({ crop });
  }

  setImage = (image) => {
    this.image = image;
  };

  cropImage() {
    const { image } = this;
    const { crop } = this.state;
    if (!image) {
      return Promise.reject(new Error('IMAGE_NOT_LOADED'));
    }

    const { cropSize, mimeType, qualityArgument } = this.props;

    let canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const outputWidth = cropSize.width || crop.width;
    const outputHeight = cropSize.height || crop.height;
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      outputWidth,
      outputHeight,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (file) => {
          canvas = null;
          resolve(file);
        },
        mimeType,
        qualityArgument,
      );
    });
  }

  handleCropChange = (crop) => {
    this.setState({ crop });
    this.props.onChange && this.props.onChange(crop);
  };

  render() {
    const { src, namespace, className, crossorigin } = this.props;
    const blockName = `${namespace}-ImageCropPanel`;
    return (
      <div className={classNames(blockName, className)}>
        <div className={`${blockName}__content`}>
          <ReactCrop
            onChange={this.handleCropChange}
            onImageLoaded={this.setImage}
            crop={this.state.crop}
            src={src}
            crossorigin={crossorigin}
            keepSelection
          />
        </div>
      </div>
    );
  }
}

export default CropPanel;
