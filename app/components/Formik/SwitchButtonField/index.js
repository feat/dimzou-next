import React from 'react';
import PropTypes from 'prop-types';
// import Input from "@feat/feat-ui/lib/float-label-input";

// import { FieldProps } from 'formik';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import SwitchButton from '@feat/feat-ui/lib/switch-button';

// import getValidateStatus from './helpers/getValidateStatus';

class SwitchButtonField extends React.PureComponent {
  handleChange = (value) => {
    const {
      field: { name },
      form: { setFieldValue },
    } = this.props;
    setFieldValue(name, value);
  };

  render() {
    const { field, label, form, ...custom } = this.props;
    // const validateStatus = getValidateStatus(meta);
    const error = form.errors[field.name];
    const validateStatus = (form.submitCount || 
      form.touched[field.name]) && error ? 'error' : undefined;
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
        {({ handleFocus, handleBlur }) => (
          <SwitchButton
            block
            className="t-left"
            options={custom.options}
            initialValue={field.value}
            placeholder={custom.placeholder}
            onChange={this.handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
          />
        )}
      </FormItem>
    );
  }
}

SwitchButtonField.propTypes = {
  form: PropTypes.object,
  field: PropTypes.object,
  label: PropTypes.node,
  beforeChange: PropTypes.func,
  onChange: PropTypes.func,
  size: PropTypes.string,
};

export default SwitchButtonField;
