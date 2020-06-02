import React from 'react';
import PropTypes from 'prop-types';
import CropPanel from '@feat/feat-ui/lib/image-cropper/CropPanel';
import readBlobImage from '@feat/feat-ui/lib/util/readBlobImage';
import 'react-image-crop/dist/ReactCrop.css';

/** 图片裁剪器 */
export default class Example extends React.Component {
  state = {
    src: null,
  };

  handleChange = (e) => {
    readBlobImage(e.target.files[0]).then((url) => {
      this.setState({ src: url });
    });
  };

  handleCrop = (e) => {
    this.cropPanel.getValue().then((data) => {
      this.setState({
        preview: URL.createObjectURL(data.preview),
      });
    });
  };

  handleClose = () => {
    this.setState({ src: null });
    this.form.reset();
  };

  render() {
    const { src, preview } = this.state;
    return (
      <div>
        {src && (
          <div style={{maxWidth:  400}}>
            <CropPanel
              ref={(n) => {
                this.cropPanel = n;
              }}
              src={src}
              cropSize={{ width: 50, height: 50 }}
            />
            <button onClick={this.handleCrop}>crop</button>
            <button onClick={this.handleClose}>cancel</button>
          </div>
        )}
        <div>{preview && <img src={preview} alt="preview" />}</div>
        <form
          ref={(n) => {
            this.form = n;
          }}
        >
          <input type="file" onChange={this.handleChange} />
          {preview && (
            <a href={preview} download="image.jpeg">
              download
            </a>
          )}
        </form>
      </div>
    );
  }
}
