import React from "react";
import PropTypes from "prop-types";
import ReactCrop from "react-image-crop";
import Button from "../button";
import { namespace as defaultNamespace } from "../config";
import getImageSize from "../util/getImageSize";

function noop() {}
export default class ImageCrop extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    submitPic: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    defaultCrop: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
      aspect: PropTypes.number,
    }),
    namespace: PropTypes.string,
    blockName: PropTypes.string,
  };

  static defaultProps = {
    defaultCrop: {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      aspect: 1,
    },
    cropSize: false,
    onClose: noop,
    namespace: defaultNamespace,
    blockName: "ImageCrop",
  };

  constructor(props) {
    super(props);
    this.image = null;
    this.state = {
      crop: props.defaultCrop,
    };
  }

  createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  handleCropChange = (crop) => {
    this.setState({ crop });
  }

  componentWillMount() {
    getImageSize(this.props.src, true).then((res) => {
      this.image = res;
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      getImageSize(nextProps.src, true).then((res) => {
        this.image = res;
      });
    }
  }

  cancelCrop = (e) => {
    this.props.onClose();
  }

  cropImage = (e) => {
    const { width, height } = this.image;
    const { crop } = this.state;
    const { cropSize } = this.props;


    const sX = crop.x * width / 100;
    const sY = crop.y * height / 100;
    const sWidth = crop.width * width / 100;
    const sHeight = crop.height * height / 100;
    let outputWidth = sWidth;
    let outputHeight = sHeight;
    if (cropSize) {
      outputWidth = cropSize.width;
      outputHeight = cropSize.height;
    }

    let canvas = this.createCanvas(outputWidth, outputHeight);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(this.image, sX, sY, sWidth, sHeight, 0, 0, outputWidth, outputHeight);
    canvas.toBlob((file) => {
      canvas = null;
      this.props.submitPic(file);
    }, "image/jpeg", 0.9);
  }

  render() {
    const { src, blockName, namespace } = this.props;
    const prefixCls = `${namespace}-${blockName}`;
    return (
      <div className="ft-ImageCrop">
        <div className={`${prefixCls}__content`}>
          <ReactCrop
            onChange={this.handleCropChange}
            crop={this.state.crop}
            src={src}
            keepSelection
          />
        </div>
        <div className={`${prefixCls}__ctrl`}>
          <Button onClick={this.cropImage} className={`${prefixCls}__confirmButton`}>
            OK
          </Button>
          <Button onClick={this.cancelCrop} className={`${prefixCls}__cancelButton`}>
            NO
          </Button>
        </div>
      </div>
    );
  }
}
