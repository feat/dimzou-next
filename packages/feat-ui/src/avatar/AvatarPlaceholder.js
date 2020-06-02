import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { namespace as defaultNamespace } from "../config";

function AvatarPlaceholder(props) {
  const { namespace, className, round, size } = props;
  const baseName = `${namespace}-AvatarPlaceholder`;

  return (
    <span
      className={classNames(baseName, className, {
        [`${baseName}_round`]: round,
        [`${baseName}_${size}`]: size,
      })}
    />
  );
}

AvatarPlaceholder.propTypes = {
  className: PropTypes.string,
  namespace: PropTypes.string,
  size: PropTypes.oneOf(["xxs", "xs", "sm", "md", "lg", "xl"]),
  round: PropTypes.bool,
};

AvatarPlaceholder.defaultProps = {
  namespace: defaultNamespace,
  size: "sm",
};

export default AvatarPlaceholder;
