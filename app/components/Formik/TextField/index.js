import React from 'react';
import PropTypes from 'prop-types';
// import Input from "@feat/feat-ui/lib/float-label-input";

// import { FieldProps } from 'formik';
import Input from '@feat/feat-ui/lib/text-input';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';

// import getValidateStatus from './helpers/getValidateStatus';

const LoadingWidget = () => (
  <div
    className="relative"
    style={{
      width: '20px',
      height: '20px',
    }}
  >
    ...
  </div>
);

class TextField extends React.PureComponent {
  handleChange = (e) => {
    let shouldChange = true;
    if (this.props.beforeChange) {
      shouldChange = this.props.beforeChange(e);
    }
    if (shouldChange) {
      if (this.props.onChange) {
        this.props.onChange(e.target.value);
      } else {
        this.props.field.onChange(e);
      }
    }
  };

  render() {
    const { field, label, form, ...custom } = this.props;
    // const validateStatus = getValidateStatus(meta);
    const error = form.errors[field.name];
    const validateStatus = (form.submitCount || 
      form.touched[field.name]) && error ? 'error' : undefined;
    const asyncValidating = false;
    return (
      <FormItem
        className={custom.className}
        label={<FormLabel>{label}</FormLabel>}
        help={
          validateStatus ? (
            <FormHelp data={error} />
          ) : (
            custom.help && <FormHelp data={custom.help} />
          )
        }
        validateStatus={validateStatus}
        modifier={custom.modifier}
      >
        {({ handleBlur, handleFocus, bindWidget }) => (
          <Input
            value={field.value}
            ref={(n) => {
              bindWidget(n);
              if (custom.inputRef) {
                custom.inputRef(n);
              }
            }}
            name={field.name}
            block
            size={this.props.size}
            placeholder={custom.placeholder}
            type={custom.type}
            disabled={custom.disabled}
            onChange={this.handleChange}
            onBlur={(e) => {
              field.onBlur(e);
              handleBlur();
              if (custom.onBlur) {
                custom.onBlur(e);
              }
            }}
            onKeyPress={custom.onKeyPress}
            onFocus={handleFocus}
            autoFocus={custom.autoFocus}
            autoComplete={custom.autoComplete}
            addonBefore={custom.addonBefore}
            addonAfter={asyncValidating ? <LoadingWidget /> : custom.addonAfter}
            prefix={custom.prefix}
            suffix={custom.suffix}
          />
        )}
      </FormItem>
    );
  }
}

TextField.propTypes = {
  form: PropTypes.object,
  field: PropTypes.object,
  label: PropTypes.node,
  beforeChange: PropTypes.func,
  onChange: PropTypes.func,
  size: PropTypes.string,
};

export default TextField;
