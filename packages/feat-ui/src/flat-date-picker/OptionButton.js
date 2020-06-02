import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function OptionButton(props) {
  const { type, value, label, onClick } = props;
  return (
    <div
      className={classNames(
        "ft-FlatDatePicker__option",
        `ft-FlatDatePicker__option_${type}`,
        props.className
      )}
      data-type={type}
      data-value={value}
      onClick={onClick}
      role="button"
      tabIndex="-1"
    >
      {label}
    </div>
  );
}

OptionButton.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.number,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
};
