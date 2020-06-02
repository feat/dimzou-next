import React from 'react';
import PropTypes from 'prop-types';
// import { FieldProps } from 'formik';

import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import Radio from '@feat/feat-ui/lib/radio';

class RadioButtonField extends React.PureComponent {
  handleChange = (value) => {
    const { field, form } = this.props;
    form.setFieldTouched(field.name);
    form.setFieldValue(field.name, value);
  };

  render() {
    const {
      field,
      form,
      help,
      label,
      options,
      renderOption,
      ...custom
    } = this.props;
    const error = form.errors[field.name];
    const validateStatus = form.touched[field.name] && error ? 'error' : undefined;
    return (
      <FormItem
        label={<FormLabel>{label}</FormLabel>}
        help={
          validateStatus === 'error' ? (
            <FormHelp data={error} />
          ) : (
            help && <FormHelp data={help} />
          )
        }
        validateStatus={validateStatus}
        modifier={custom.modifier}
        className={custom.className}
      >
        {({ handleFocus, handleBlur }) => (
          <Radio.Group block onChange={this.handleChange} value={field.value}>
            {options.map(
              (option) =>
                renderOption ? (
                  renderOption(option, {
                    onFocus: handleFocus,
                    onBlur: handleBlur,
                    size: custom.size,
                  })
                ) : (
                  <Radio.Button
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={option.value}
                    key={option.value}
                    size={custom.size}
                  >
                    {option.label}
                  </Radio.Button>
                ),
            )}
          </Radio.Group>
        )}
      </FormItem>
    );
  }
}

RadioButtonField.propTypes = {
  // ...FieldProps,
  form: PropTypes.object,
  field: PropTypes.object,
  label: PropTypes.node,
  help: PropTypes.node,
  options: PropTypes.array,
  renderOption: PropTypes.func,
};

export default RadioButtonField;
