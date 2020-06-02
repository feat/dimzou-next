import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function Footer(props) {
  const { className, children, ...restProps } = props;
  return (
    <footer
      className={classNames(className, "ft-Site__footer")}
      {...restProps}
    >
      {children}
    </footer>
  );
}
