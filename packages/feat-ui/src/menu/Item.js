import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { namespace as defaultNamespace } from "../config";

const Item = (props) => {
  const { className, namespace, active, icon, children, ...restProps } = props;
  const blockName = `${namespace}-Menu__item`;
  return (
    <div
      className={classNames(blockName, className, {
        [`${blockName}_icon`]: icon,
        "is-active": active,
      })}
      {...restProps}
    >
      {children}
    </div>
  );
};

Item.propTypes = {
  className: PropTypes.string,
  namespace: PropTypes.string.isRequired,
  active: PropTypes.bool,
  icon: PropTypes.bool,
  children: PropTypes.node,
};

Item.defaultProps = {
  namespace: defaultNamespace,
};

export default Item;
