import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function Icon(props) {
  const { name, className, style } = props;
  const classes = classNames(className, {
    "ft-Icon": true,
    [`ft-Icon_${name}`]: name,
  });
  return (
    <i className={classes} style={style} />
  );
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};
