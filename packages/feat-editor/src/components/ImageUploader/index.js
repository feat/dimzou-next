import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import readeFileAsURL from '../../utils/readFileAsURL';

const getFile = state => state.options && state.options.data;
const getSrc = state => state.data && state.data.src;

class ImageUploader extends React.Component {
  state = this.props.uploadManager.getTask(this.props.uploadKey) || {};
  componentDidMount() {
    const { uploadKey, uploadManager } = this.props;
    uploadManager.subscribe(uploadKey, this.handleChange);
    const file = getFile(this.state);
    const src = getSrc(this.state);
    if (file) {
      this.getPreviewInfo(file);
    } else if (src) {
      this.prepareImage(src);
    }
  }
  componentWillUpdate(nextProps, nextState) {
    const nextFile = getFile(nextState);
    const file = getFile(this.state);
    if (nextFile && nextFile !== file) {
      console.log('read file');
      this.getPreviewInfo(nextFile);
    }
    if (!this.state.data && nextState.data && nextState.data.src) {
      this.prepareImage(nextState.data.src);
    }
  }
  getPreviewInfo(file) {
    readeFileAsURL(file)
      .then(url =>
        this.setState({
          previewURL: url,
        }),
      )
      .catch(() => {
        this.setState({
          previewHint: 'Failed To Read Image',
        });
      });
  }
  prepareImage = (src) => {
    const image = new Image();
    image.onload = () => {
      this.setState({
        isImageReady: true,
      });
    };
    image.src = src;
  };
  handleChange = (data) => {
    this.setState(data);
  };
  render() {
    const { loading, data, error, previewURL, previewHint, isImageReady } = this.state;
    const { onClick, offsetKey, entityKey, className } = this.props;
    if (loading || !isImageReady || error) {
      return (
        <div className="FeatEditor__imageUploader">
          {!previewURL && !previewHint && <div>Uploading...</div>}
          {error && <div className="FeatEditor__imageUploaderError">Failed To Upload Image;</div>}
          {previewURL &&
            !isImageReady && <img className="FeatEditor__imagePreview" src={previewURL} alt="" />}
          {!previewURL && previewHint && <div>{previewHint}</div>}
        </div>
      );
    }
    if (data) {
      const blockKey = offsetKey.split('-')[0];
      const dragData = { entityKey, blockKey };
      return (
        <div className="FeatEditor__imageWrap">
          <img
            onClick={onClick}
            data-offset-key={offsetKey}
            src={data.src}
            alt={data.alt}
            className={classNames('FeatEditor__image', className)}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
            }}
          />
        </div>
      );
    }
    // const taskData = uploadManager.getValue(key);

    // if (taskData.loading) {
    //   return <div>Loading...</div>;
    // }
    return <div>TODO</div>;
  }
}

ImageUploader.propTypes = {
  className: PropTypes.string,
  contentState: PropTypes.object,
  offsetKey: PropTypes.string,
  entityKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  uploadKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  uploadManager: PropTypes.shape({
    getTask: PropTypes.func,
  }).isRequired,
};

export default ImageUploader;
