import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import defaultAvatar from "./img/defaultAvatar.svg";

import { namespace as defaultNamespace } from "../config";

export default function Avatar(props) {
  const {
    namespace,
    round,
    size,
    archived,
    avatar,
    username,
    className,
    ...restProps
  } = props;
  const blockName = `${namespace}-Avatar`;

  const avatarClassName = classNames(className, {
    [blockName]: true,
    [`${blockName}_${size}`]: true,
    [`${blockName}_round`]: round,
    [`${blockName}_archived`]: archived,
  });

  return (
    <img
      className={avatarClassName}
      src={avatar}
      alt={username}
      {...restProps}
    />
  );
}

Avatar.propTypes = {
  className: PropTypes.string,
  namespace: PropTypes.string,
  size: PropTypes.oneOf(["xxs", "xs", "sm", "md", "lg", "xl"]),
  round: PropTypes.bool,
  archived: PropTypes.bool,
  avatar: PropTypes.string,
  username: PropTypes.string,
};

Avatar.defaultProps = {
  namespace: defaultNamespace,
  size: "sm",
  avatar: defaultAvatar,
};
