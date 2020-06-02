import React from 'react';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';

import { formatMessage } from '@/services/intl';

import readFileAsURL from '@/utils/readFileAsURL';

import notification from '@feat/feat-ui/lib/notification';

import { ATTACHMENT_MAX_SIZE } from '../../constants';
import CoverPlaceholder from '../CoverBlockRender/CoverPlaceholder';
import CoverCropper from '../CoverCropper';

import dropTips from '@/images/drop-tips.svg';
import intlMessages from '../../messages';

const preparePreview = (file) => {
  if (file.preview) {
    return Promise.resolve();
  }
  
  return readFileAsURL(file).then((url) => {
    // eslint-disable-next-line
      file.preview = url;
  });
};

class ImageDropzone extends React.PureComponent {
    state = {
      // image: undefined,
      isCropPannelOpened: false,
    }

    getImage() {
      if (this.props.data && this.props.data.preview) {
        return this.props.data.preview;
      }
      return undefined;
    }

    handleCoverDropzone = (files) => {
      if (files.length) {
        window.scrollTo(0, 0);
        const box = this.viewBox.getBoundingClientRect();
        const file = files[0];
        preparePreview(file)
          .then(() => {
            const state = {
              file,
              sourceImage: file.preview,
              box: {
                left: box.left,
                top: box.top,
                right: box.right,
                bottom: box.bottom,
                width: box.width,
                height: box.height,
              },
              isCropPannelOpened: true,
            };
            this.setState(state)
          })
          .catch((err) => {
            notification.error({
              message: 'Error',
              description: err.message,
            });
            logging.error(err);
          });
      }
    }

    handleCancel = () => {
      this.setState({
        isCropPannelOpened: false,
        file: null,
        sourceImage: undefined,
      })
    }

    handleConfirm = (data) => {
      this.props.onConfirm({
        ...data,
        sourceImage: this.state.file,
      })
      this.setState({
        isCropPannelOpened: false,
      })
    }

    initCrop = () => {
      this.setState({
        file: this.props.data.sourceImage,
        sourceImage: this.props.data.sourceImage.preview,
        cropInfo: this.props.data.data,
        isCropPannelOpened: true,
      })
    }

    render() {
      const { ratio, data } = this.props;
      const sourceImage = data && data.sourceImage;
      const preview = data && data.preview;

      return (
        <div className="dz-ImageDropzone">
          <Dropzone
            maxSize={ATTACHMENT_MAX_SIZE * 1024 * 1024}
            onDrop={this.handleCoverDropzone}
            multiple={false}
            onClick={(e) => {
              e.preventDefault();
            }}
            onDropRejected={this.handleCorverDropRejected}
            onDragOver={(e) => {
              e.stopPropagation();
            }}
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                className={classNames('dz-CoverSection__dropzone', {
                  'is-active': isDragActive,
                })}
                style={{ paddingTop: `${100 / ratio}%` }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <div
                  className={classNames('dz-CoverSection__viewBox')}
                  ref={(n) => {
                    this.viewBox = n;
                  }}
                  onClick={sourceImage ? this.initCrop : undefined}
                >
                  <CoverPlaceholder image={this.getImage()} ratio={ratio} />
                </div>
                {!preview && (
                  <div
                    className="dz-CoverSection__dropTips"
                    dangerouslySetInnerHTML={{
                      __html: `<div>${dropTips} <div class="dz-CoverSection__dropTips_tips">${formatMessage(
                        intlMessages.dropImageTips,
                      )}</div></div>`,
                    }}
                  />
                )}
              </div>
            )}
          </Dropzone>
          {this.state.isCropPannelOpened && (
            <CoverCropper
              previewBox={this.state.box}
              data={this.state.cropInfo}
              sourceImage={this.state.sourceImage}
              onCancel={this.handleCancel}
              onConfirm={this.handleConfirm}
            />
          )}
        </div>
      )
    }
}

export default ImageDropzone;