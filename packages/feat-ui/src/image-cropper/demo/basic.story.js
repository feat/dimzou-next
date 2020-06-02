import React from "react";
import PropTypes from "prop-types";
import ImageCropper from "@feat/feat-ui/lib/image-cropper";
import readBlobImage from "@feat/feat-ui/lib/util/readBlobImage";

/** 图片裁剪器 */
export default class Example extends React.Component {
  state = {
    src: null,
  }

  handleChange = (e) => {
    readBlobImage(e.target.files[0]).then((url) => {
      this.setState({ src: url });
    });
  }

  submitPic = (blob) => {
    console.log(blob);
    readBlobImage(blob).then((url) => {
      this.setState({ preview: url });
    });
  }

  handleClose = () => {
    this.setState({ src: null });
    this.form.reset();
  }

  render() {
    const { src, preview } = this.state;
    return (
      <div>
        {src && <ImageCropper src={src} submitPic={this.submitPic} onClose={this.handleClose} />}
        <div>{preview && <img src={preview} />}</div>
        <form ref={(n) => { this.form = n; }}>
          <input type="file" onChange={this.handleChange} />
          {preview && <a href={preview} download="image.jpeg">download</a>}
        </form>
      </div>
    );
  }
}
