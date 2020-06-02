import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { namespace as defaultNamespace } from "../config";

export default function Tab(props) {
  const { namespace, className, active, onClick, dataKey, ...restProps } = props;
  const baseName = `${namespace}-TabItem`;
  return (
    <span
      className={classNames(baseName, `${baseName}_normal`, {
        "is-active": active,
      })}
      onClick={onClick}
      {...restProps}
    >
      <span className={`${baseName}__label`}>{props.children}</span>
    </span>
  );
}

Tab.propTypes = {
  namespace: PropTypes.string,
  dataKey: PropTypes.any,
};
Tab.defaultProps = {
  namespace: defaultNamespace,
};
