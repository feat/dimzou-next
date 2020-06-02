import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { namespace as defaultNamespace } from "../config";

export default function StaticMenu(props) {
  const { className, children, mode, modifier, blockName, namespace, ...restProps } = props;
  const prefixClass = `${namespace}-${blockName}`;
  return (
    <ul
      className={classNames(className, {
        [prefixClass]: true,
        [`${prefixClass}_${mode}`]: mode,
        [`${prefixClass}_${modifier}`]: modifier,
      })}
      {...restProps}
    >
      {React.Children.map(children, (item) => {
        if (!item) return null;
        if (!modifier) return item;
        return React.cloneElement(item, { modifier, prefixClass });
      })}
    </ul>
  );
}

StaticMenu.propTypes = {
  mode: PropTypes.oneOf(["inline", "horizontal", "vertical"]),
  namespace: PropTypes.string,
  blockName: PropTypes.string,
};

StaticMenu.defaultProps = {
  mode: "inline",
  namespace: defaultNamespace,
  blockName: "Menu",
};
