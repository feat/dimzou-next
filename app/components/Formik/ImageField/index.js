import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
// import { FieldProps } from 'formik';

import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import CropPanel from '@feat/feat-ui/lib/image-cropper/CropPanel';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import './style.scss';

class ImageField extends React.Component {
  state = {
    src: undefined,
    isCropOpened: false,
    imgHeight: 0,
    preview: undefined,
  };

  handleDrop = (files) => {
    const {
      field: { name },
      form: { setFieldTouched },
    } = this.props;

    const img = new Image();
    img.src = URL.createObjectURL(files[0]);
    img.onload = () => {
      const imgWidth = img.width;
      this.setState({
        imgHeight: img.height / (imgWidth / 960),
      });
    };

    setFieldTouched(name);
    // setFieldValue(name, files[0]);
    this.setState({
      src: URL.createObjectURL(files[0]),
      isCropOpened: true,
    });
  };

  handleCropClose = () => {
    this.reset();
  };

  handleComfirm = () => {
    const {
      field: { name },
      form: { setFieldValue },
    } = this.props;
    this.cropPanel.getValue().then((data) => {
      this.setState({
        preview: URL.createObjectURL(data.preview),
      });
      setFieldValue(name, data.preview);
      this.reset();
    });
  };

  reset() {
    this.setState({
      src: undefined,
      isCropOpened: false,
    });
  }

  render() {
    const { field, label, form, ...custom } = this.props;
    const error = form.errors[field.name];
    const validateStatus =
      form.touched[field.name] && error ? 'error' : undefined;
    return (
      <FormItem
        label={<FormLabel>{label}</FormLabel>}
        modifier={custom.modifier}
        help={
          validateStatus === 'error' ? (
            <FormHelp data={error} />
          ) : (
            custom.help && <FormHelp data={custom.help} />
          )
        }
        validateStatus={validateStatus}
        className="ft-ImageForm"
      >
        <Dropzone
          value={field.value}
          onChange={field.onChange}
          onDrop={this.handleDrop}
          onDragOver={(e) => {
            e.stopPropagation();
          }}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={classNames('ft-ImageDropzone', {
                'is-active': isDragActive,
              })}
            >
              {this.state.src || this.state.preview ? (
                <img
                  alt={custom.alt}
                  src={this.state.src || this.state.preview}
                  style={{ width: '100%', display: 'block' }}
                />
              ) : (
                <span className="ft-ImageDropzone__placeholder">
                  {custom.placeholder}
                </span>
              )}
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
        {this.state.isCropOpened &&
          this.state.src && (
          <div
            className="ft-ImageDropzone__cropContainer"
            style={{
              minHeight: this.state.imgHeight,
              height: this.state.imgHeight !== 0 ? 'auto' : '600px',
            }}
          >
            <CropPanel
              ref={(n) => {
                this.cropPanel = n;
              }}
              src={this.state.src}
              crossorigin="Anonymous"
              defaultCrop={{ width: 50, height: 50, aspect: 1.6, unit: '%' }}
            />
            <div className="ft-ImageDropzone__cropControls">
              <IconButton
                className="margin_r_24"
                svgIcon="no-btn"
                size="md"
                onClick={this.handleCropClose}
              />
              <IconButton
                svgIcon="ok-btn"
                size="md"
                onClick={this.handleComfirm}
              />
            </div>
          </div>
        )}
      </FormItem>
    );
  }
}

ImageField.propTypes = {
  form: PropTypes.object,
  field: PropTypes.object,
};

export default ImageField;
