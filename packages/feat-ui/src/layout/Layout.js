import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function Layout(props) {
  const { className, children, mode, ...restProps } = props;
  return (
    <div
      className={classNames(className, "ft-Site", {
        "ft-Site_fixedHeader": mode === "fixed-header",
        "ft-Site_staticHeader": mode === "static-header",
      })}
      {...restProps}
    >
      {children}
    </div>
  );
}

Layout.propTypes = {
  mode: PropTypes.oneOf(["fixed-header", "static-header"]),
};

Layout.defaultProps = {
  mode: "static-header",
};
