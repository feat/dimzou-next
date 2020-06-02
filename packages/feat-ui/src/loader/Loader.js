import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { namespace as defaultNamespace } from "../config";

export default function Loader(props) {
  const { className, size, namespace, children, color, direction } = props;
  const baseName = `${namespace}-Loader`;

  return (
    <div
      className={cx(
        baseName,
        `${baseName}_${size}`,
        `${baseName}_${direction}`,
        `${baseName}_${color}`,
        className
      )}
    >
      <div className={cx(`${baseName}__symbol`)}>
        <div />
        <div />
        <div />
        <div />
      </div>
      {children && <div className={cx(`${baseName}__content`)}>{children}</div>}
    </div>
  );
}

Loader.propTypes = {
  size: PropTypes.oneOf(["xxs", "xs", "sm", "md", "lg", "xl"]),
  color: PropTypes.oneOf(["default", "white", "inverse"]),
  direction: PropTypes.oneOf(["horizontal", "vertical"]),
};

Loader.defaultProps = {
  size: "sm",
  namespace: defaultNamespace,
  color: "default",
  direction: "horizontal",
};
