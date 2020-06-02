import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function Header(props) {
  const { className, children, ...restProps } = props;
  return (
    <header
      className={classNames(className, "ft-Site__header")}
      {...restProps}
    >
      {children}
    </header>
  );
}
