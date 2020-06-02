import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';

import readFileAsURL from '@/utils/readFileAsURL';

import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
import Popover from '@feat/feat-ui/lib/popover';

import './style.scss';

function preparePreview(file) {
  if (file.preview) {
    return Promise.resolve();
  }

  return readFileAsURL(file).then((url) => {
    // eslint-disable-next-line
    file.preview = url;
  });
}

class ImagesDropzone extends React.Component {
  handleDrop = (files) => {
    const images = files.filter((file) => /^image/.test(file.type));
    Promise.all(images.map(preparePreview))
      .then(() => {
        this.props.onChange(
          [...this.props.value, ...images].slice(0, this.props.maxCount),
        );
      })
      .catch((err) => {
        logging.error(err);
      });
  };

  removeIndex = (index) => {
    const removed = [
      ...this.props.value.slice(0, index),
      ...this.props.value.slice(index + 1),
    ];
    this.props.onChange(removed);
  };

  renderPreviews(props) {
    const count = [...new Array(this.props.maxCount)];
    const { isDragActive, isDragAccept } = props;
    return (
      <React.Fragment>
        {count.map((_, index) => {
          if (this.props.value[index]) {
            return (
              <Popover
                node={this.popoverNode}
                content={
                  <img
                    className="ft-ImagesDropzone__preview"
                    src={this.props.value[index].preview}
                    alt={this.props.value[index].name}
                  />
                }
              >
                <div
                  className={classNames('ft-ImagesDropzone__thumb')}
                  style={{
                    backgroundImage: `url(${this.props.value[index].preview})`,
                  }}
                  key={index}
                >
                  <SquareButton
                    className="ft-ImagesDropzone__removeBtn"
                    onClick={() => this.removeIndex(index)}
                  >
                    &times;
                  </SquareButton>
                </div>
              </Popover>
            );
          }
          return (
            <div
              className={classNames('ft-ImagesDropzone__thumb', {
                'has-focus':
                  isDragActive &&
                  isDragAccept &&
                  this.props.value &&
                  index === this.props.value.length,
              })}
              key={index}
            />
          );
        })}
      </React.Fragment>
    );
  }

  render() {
    return (
      <Dropzone
        onDrop={this.handleDrop}
        onChange={this.handleChange}
        onDragOver={(e) => {
          e.stopPropagation();
        }}
      >
        {(props) => (
          <div {...props.getRootProps()} className="ft-ImagesDropzone">
            {this.renderPreviews(props)}
            <input {...props.getInputProps()} />
            <div
              className="ft-ImagesDropzone__popover"
              ref={(n) => {
                this.popoverNode = n;
              }}
            />
          </div>
        )}
      </Dropzone>
    );
  }
}

ImagesDropzone.propTypes = {
  onChange: PropTypes.func,
  maxCount: PropTypes.number,
};

ImagesDropzone.defaultProps = {
  maxCount: 3,
};

export default ImagesDropzone;
