import React from 'react';
import PropTypes from 'prop-types';

function DatePickerLabel(props) {
  const { value, placeholder, format } = props;
  return value && value.format ? (
    value.format(format)
  ) : (
    <span className="t-placeholder">{placeholder}</span>
  );
}

DatePickerLabel.propTypes = {
  value: PropTypes.any,
  placeholder: PropTypes.node,
  format: PropTypes.string,
};

export default DatePickerLabel;
