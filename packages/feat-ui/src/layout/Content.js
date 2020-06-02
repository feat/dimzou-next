import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function Content(props) {
  const { className, children, ...restProps } = props;
  return (
    <div
      className={classNames(className, "ft-Site__content")}
      {...restProps}
    >
      {children}
    </div>
  );
}
