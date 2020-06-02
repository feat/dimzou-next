import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';

class SelectField extends React.PureComponent {
  handleChange = (option) => {
    const {
      field: { name },
      form: { setFieldValue },
    } = this.props;
    setFieldValue(name, option);
  };

  render() {
    const { field, form, label, help, options, ...custom } = this.props;
    const { value, name } = field;
    const error = form.errors[name];
    const validateStatus = form.touched[name] && error ? 'error' : undefined;

    return (
      <FormItem
        label={<FormLabel>{label}</FormLabel>}
        help={validateStatus === 'error' ? <FormHelp data={error} /> : help}
        validateStatus={validateStatus}
        modifier={custom.modifier}
      >
        <Select
          value={value}
          name={name}
          onChange={this.handleChange}
          options={options}
        />
      </FormItem>
    );
  }
}

SelectField.propTypes = {
  form: PropTypes.object,
  field: PropTypes.object,
  label: PropTypes.node,
  help: PropTypes.node,
  options: PropTypes.array,
};

export default SelectField;
