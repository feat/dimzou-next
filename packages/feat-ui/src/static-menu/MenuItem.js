import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function StaticMenuItem(props) {
  const { className, children, active, modifier, prefixClass, ...restProps } = props;
  return (
    <li
      className={classNames(
        className, {
          [`${prefixClass}Item`]: true,
          [`${prefixClass}Item_${modifier}`]: modifier,
          "is-active": active,
        })}
      {...restProps}
    >
      {children}
    </li>
  );
}

StaticMenuItem.propTypes = {
  active: PropTypes.bool,
};
