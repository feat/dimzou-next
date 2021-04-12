/**
 * 图片上传组件
 * 拖动选择图片，然后对图片进行裁剪
 * 1. 可以设置默认显示状态，
 * 2. 当有图片数据时，必须为显示状态
 *
 */

import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NativeTypes } from 'react-dnd-html5-backend';
import { injectIntl } from 'react-intl';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';

import AppDndHandlerService from '@/services/dnd/AppDndHandlerService';
import { AppDndContext } from '@/services/dnd/AppDndService';

import readFileAsURL from '@/utils/readFileAsURL';

import notification from '@feat/feat-ui/lib/notification';
import { getMessageInstance } from '@feat/feat-ui/lib/message';

import { ATTACHMENT_MAX_SIZE } from '../../constants';
import CoverPlaceholder from '../CoverBlockRender/CoverPlaceholder';
import CoverDropTips from '../CoverDropTips';
import CoverCropper from '../CoverCropper';
import FileDropzone from '../FileDropzone';

const preparePreview = (file) => {
  if (file.preview) {
    return Promise.resolve();
  }

  return readFileAsURL(file).then((url) => {
    // eslint-disable-next-line
      file.preview = url;
  });
};

function GlobalNotice(props) {
  const appDndContext = useContext(AppDndContext);
  useEffect(
    // eslint-disable-next-line consistent-return
    () => {
      if (
        appDndContext.draggableIsFree &&
        appDndContext.itemType === NativeTypes.FILE
      ) {
        getMessageInstance().then((instance) => {
          instance.notice({
            key: 'dimzou-add-cover-notice',
            duration: null,
            content: '拖放图片并设置封面',
          });
        });
        return () => {
          getMessageInstance().then((instance) => {
            instance.removeNotice('dimzou-add-cover-notice');
          });
        };
      }
    },
    [appDndContext.draggableIsFree],
  );
  return props.children;
}

class ImageDropzone extends React.PureComponent {
  state = {
    // image: undefined,
    isCropPannelOpened: false,
    showDropzone: false,
    file: null,
    sourceImage: undefined,
    box: null,
  };

  componentDidMount() {
    AppDndHandlerService.register(NativeTypes.FILE, {
      drop: this.handleCanvasDrop,
    });
  }

  componentWillUnmount() {
    AppDndHandlerService.unregister(NativeTypes.FILE);
  }

  getImage() {
    if (this.props.data && this.props.data.preview) {
      return this.props.data.preview;
    }
    return undefined;
  }

  resetState = () => {
    this.setState({
      isCropPannelOpened: false,
      showDropzone: false,
      file: null,
      sourceImage: undefined,
    });
    this.props.onConfirm(null);
  };

  handleCanvasDrop = (item) => {
    const { files } = item;
    if (files.length && /image\/*/.test(files[0].type)) {
      this.setState(
        {
          showDropzone: true,
        },
        () => {
          this.handleCoverDropzone(item.files);
        },
      );
    }
  };

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
          this.setState(state);
        })
        .catch((err) => {
          notification.error({
            message: 'Error',
            description: err.message,
          });
          logging.error(err);
        });
    }
  };

  handleCancel = () => {
    this.setState({
      isCropPannelOpened: false,
      file: null,
      sourceImage: undefined,
    });
  };

  handleConfirm = (data) => {
    this.props.onConfirm({
      ...data,
      sourceImage: this.state.file,
    });
    this.setState({
      isCropPannelOpened: false,
    });
  };

  initCrop = () => {
    this.setState({
      file: this.props.data.sourceImage,
      sourceImage: this.props.data.sourceImage.preview,
      cropInfo: this.props.data.data,
      isCropPannelOpened: true,
    });
  };

  render() {
    const { ratio, data, visibleByDefault } = this.props;
    const sourceImage = data && data.sourceImage;
    const preview = data && data.preview;

    return (
      <GlobalNotice>
        <div className="dz-ImageDropzone">
          {(this.state.file || data) && (
            <SquareButton
              type="dashed"
              style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
              onClick={this.resetState}
            >
              &times;
            </SquareButton>
          )}
          {(visibleByDefault || this.state.showDropzone) && (
            <FileDropzone
              accept="image/*"
              maxSize={ATTACHMENT_MAX_SIZE * 1024 * 1024}
              onDrop={this.handleCoverDropzone}
              multiple={false}
              noClick
              onDropRejected={this.handleCorverDropRejected}
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
                  {!preview && <CoverDropTips />}
                </div>
              )}
            </FileDropzone>
          )}
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
      </GlobalNotice>
    );
  }
}

ImageDropzone.propTypes = {
  data: PropTypes.object,
  ratio: PropTypes.number,
  miniMode: PropTypes.bool,
  onConfirm: PropTypes.func,
  visibleByDefault: PropTypes.bool,

  intl: PropTypes.object,
};

export default injectIntl(ImageDropzone, { forwardRef: true });
