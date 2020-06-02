import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import AvatarPlaceholder from "./AvatarPlaceholder";
import AvatarStamp from "./templates";
import TextRow from "../placeholder/TextRow";

export default function AvatarStampPlaceholder(props) {
  const { namespace, className, size, reverse, modifier } = props;

  const blockName = `${namespace}-AvatarStamp`;
  return (
    <AvatarStamp
      namespace={namespace}
      className={classNames(
        `${blockName}_II`,
        `${blockName}_placeholder`,
        className,
        {
          [`${blockName}_${size}`]: size,
          [`${blockName}_reverse`]: reverse,
        }
      )}
    >
      <AvatarStamp.Avatar namespace={namespace}>
        <AvatarPlaceholder size={size} />
      </AvatarStamp.Avatar>
      <AvatarStamp.Info namespace={namespace}>
        <TextRow modifier="username" randomWidth />
        <TextRow modifier="meta" randomWidth />
      </AvatarStamp.Info>
    </AvatarStamp>
  );
}

AvatarStampPlaceholder.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  modifier: PropTypes.string,
};
AvatarStampPlaceholder.defaultProps = {
  namespace: "ft",
};
