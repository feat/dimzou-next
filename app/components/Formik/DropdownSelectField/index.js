import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FieldProps } from 'formik';

import ButtonSelect from '@feat/feat-ui/lib/button-select';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import Button from '@feat/feat-ui/lib/button';

import './style.scss';

const optionFilter = (option, filter) => {
  if (!filter) {
    return true;
  }
  const lfilter = filter.toLowerCase();

  return option.label.toLowerCase().indexOf(lfilter) > -1;
};

class DropdownSelectField extends React.PureComponent {
  handleChange = (value) => {
    const { field: { name }, form: { setFieldValue }} = this.props;
    setFieldValue(name, value);
    if (this.props.afterChange) {
      this.props.afterChange();
    }
  };

  renderOption = (option, meta) => (
    <div
      className={classNames('ft-DropdownSelect__option', {
        'is-focused': meta.isFocused,
        'is-selected': meta.isSelected,
      })}
    >
      {option.label}
    </div>
  );

  renderTrigger = (_, option, props) => (
    <Button size="lg" className="ft-DropdownSelect" block>
      {option ? <span>{option.label}</span> : props.placeholder}
    </Button>
  );

  render() {
    const {
      field,
      form,
      label,
      options,
      ...custom
    } = this.props;
    const error = form.errors[field.name];
    const validateStatus = form.touched[field.name] && error ? 'error' : undefined;
    return (
      <FormItem
        label={label}
        labelCol={custom.labelCol}
        wrapperCol={custom.wrapperCol}
        help={validateStatus ? <FormHelp validateStatus={validateStatus} data={error} /> : custom.help}
        validateStatus={validateStatus}
        modifier={custom.modifier}
      >
        <ButtonSelect
          dropdownZIndex={custom.dropdownZIndex}
          renderTrigger={this.renderTrigger}
          valueExtractor={(option) => option.id}
          value={field.value}
          onChange={this.handleChange}
          placeholder={custom.placeholder}
          options={options}
          showFilter
          renderOption={this.renderOption}
          filterOption={optionFilter}
          placement="bottomLeft"
        />
      </FormItem>
    );
  }
}

DropdownSelectField.propTypes = {
  ...FieldProps,
  options: PropTypes.array,
  afterChange: PropTypes.func,
  label: PropTypes.node,
};

export default DropdownSelectField;
