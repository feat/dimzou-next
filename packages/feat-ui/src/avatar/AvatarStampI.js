import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Avatar from "./Avatar";
import AvatarStamp from "./templates";
import AvatarStampBase from "./AvatarStampBase";

import { namespace as defaultNamespace } from "../config";

class AvatarStampI extends AvatarStampBase {
  render() {
    const {
      namespace,
      className,
      size,
      round,
      reverse,
      username,
      altUsername,
      avatar,
      online,
      uiMeta,
      uiExtraMeta,
      onUsernameClick,
      onAvatarClick,
      AvatarCompo,
    } = this.props;

    const blockName = `${namespace}-AvatarStamp`;

    return (
      <AvatarStamp
        namespace={namespace}
        className={classNames(`${blockName}_I`, className, {
          [`${blockName}_${size}`]: size,
          [`${blockName}_reverse`]: reverse,
          "is-online": online,
        })}
      >
        <AvatarStamp.Avatar namespace={namespace} onClick={onAvatarClick}>
          {typeof avatar === "string" || avatar === undefined ? (
            <AvatarCompo
              namespace={namespace}
              username={altUsername || username}
              avatar={avatar}
              size={size}
              round={round}
            />
          ) : (
            avatar
          )}
        </AvatarStamp.Avatar>
        <AvatarStamp.Info namespace={namespace}>
          <AvatarStamp.Username namespace={namespace} onClick={onUsernameClick}>
            {username}
          </AvatarStamp.Username>
          {uiMeta && (
            <AvatarStamp.Desc namespace={namespace}>
              {this.renderMetaArray(blockName, uiMeta)}
            </AvatarStamp.Desc>
          )}
          {uiExtraMeta && (
            <AvatarStamp.Meta namespace={namespace}>
              {this.renderMetaArray(blockName, uiExtraMeta)}
            </AvatarStamp.Meta>
          )}
        </AvatarStamp.Info>
      </AvatarStamp>
    );
  }
}

AvatarStampI.propTypes = Object.assign({}, Avatar.propTypes, {
  avatar: PropTypes.node,
  username: PropTypes.node.isRequired,
  altUsername: PropTypes.string,
  uiMeta: PropTypes.arrayOf(PropTypes.string),
  uiExtraMeta: PropTypes.arrayOf(PropTypes.string),
  uiMetaSeparator: PropTypes.node,
  online: PropTypes.bool,
  reverse: PropTypes.bool,
  onUsernameClick: PropTypes.func,
  onAvatarClick: PropTypes.func,
  AvatarCompo: PropTypes.func,
});

AvatarStampI.defaultProps = {
  namespace: defaultNamespace,
  AvatarCompo: Avatar,
  separator: AvatarStampBase.defaultProps.separator,
};

export default AvatarStampI;
