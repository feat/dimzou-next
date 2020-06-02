import React from 'react';
import PropTypes from 'prop-types';

import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import Checkbox from '@feat/feat-ui/lib/checkbox';

class BoolField extends React.PureComponent {
  handleChange = (e) => {
    const {
      field: { name },
      form: { setFieldValue },
    } = this.props;
    setFieldValue(name, e.target.checked);
  };

  render() {
    const { field, form, help, label, modifier, wrapperClassName } = this.props;
    const error = form.errors[field.name];
    const validateStatus =
      form.touched[field.name] && error ? 'error' : undefined;

    return (
      <FormItem
        help={validateStatus ? <FormHelp data={error} /> : help}
        validateStatus={validateStatus}
        modifier={modifier}
      >
        <div className={wrapperClassName}>
          <Checkbox checked={field.value} onChange={this.handleChange}>
            {label}
          </Checkbox>
        </div>
      </FormItem>
    );
  }
}

BoolField.propTypes = {
  wrapperClassName: PropTypes.string,
  modifier: PropTypes.string,
  help: PropTypes.node,
  label: PropTypes.node,
  form: PropTypes.object,
  field: PropTypes.object,
};

export default BoolField;
