import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { namespace as defaultNamespace } from "../config";

const Navbar = (props) => {
  const { className, namespace, children, ...restProps } = props;
  const blockName = `${namespace}-Navbar`;

  return (
    <div
      className={classNames(className, blockName)}
      {...restProps}
    >
      <div className={`${blockName}__wrap`}>
        {children}
      </div>
    </div>
  );
};

Navbar.propTypes = {
  namespace: PropTypes.string,
};

Navbar.defaultProps = {
  namespace: defaultNamespace,
};


export default Navbar;
