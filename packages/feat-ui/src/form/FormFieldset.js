import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function FormFieldset(props) {
  const { children, className, ...restProps } = props;
  return (
    <div
      {...restProps}
      className={classNames(className, "ft-FormFieldset")}
    >
      {children}
    </div>
  );
}
