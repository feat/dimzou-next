import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { namespace as defaultNamespace } from "../config";

export default function StaticMenu(props) {
  const { className, children, mode, blockName, namespace } = props;
  const prefixCls = `${namespace}-${blockName}`;
  return (
    <div
      className={classNames(className, {
        [prefixCls]: true,
        [`${prefixCls}_${mode}`]: mode,
      })}
    >
      {children}
    </div>
  );
}

StaticMenu.propTypes = {
  mode: PropTypes.oneOf(["inline", "horizontal", "vertical"]),
  namespace: PropTypes.string,
  blockName: PropTypes.string,
};

StaticMenu.defaultProps = {
  namespace: defaultNamespace,
  blockName: "Menu",
};
