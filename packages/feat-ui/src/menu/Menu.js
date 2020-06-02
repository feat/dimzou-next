import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { namespace as defaultNamespace } from "../config";

const Menu = (props) => {
  const { className, namespace, direction, children, ...restProps } = props;
  const blockName = `${namespace}-Menu`;
  return (
    <div
      className={classNames(className, blockName, {
        [`${blockName}_${direction}`]: true,
      })}
      {...restProps}
    >
      {children}
    </div>
  );
};

Menu.propTypes = {
  className: PropTypes.string,
  namespace: PropTypes.string,
  direction: PropTypes.oneOf(["vertical", "horizontal"]),
};

Menu.defaultProps = {
  namespace: defaultNamespace,
  direction: "horizontal",
};

export default Menu;
