import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Avatar from "./Avatar";
import AvatarStamp from "./templates";
import AvatarStampBase from "./AvatarStampBase";

import { namespace as defaultNamespace } from "../config";

class AvatarStampII extends AvatarStampBase {
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
        className={classNames(`${blockName}_II`, className, {
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
          <div className={`${blockName}__usernameWrap`}>
            <AvatarStamp.Username
              namespace={namespace}
              onClick={onUsernameClick}
            >
              {username}
            </AvatarStamp.Username>
            {uiExtraMeta && (
              <AvatarStamp.Meta namespace={namespace}>
                {this.renderMetaArray(blockName, uiExtraMeta)}
              </AvatarStamp.Meta>
            )}
          </div>
          {uiMeta && (
            <AvatarStamp.Desc namespace={namespace}>
              {this.renderMetaArray(blockName, uiMeta)}
            </AvatarStamp.Desc>
          )}
        </AvatarStamp.Info>
      </AvatarStamp>
    );
  }
}

AvatarStampII.propTypes = Object.assign({}, Avatar.propTypes, {
  avatar: PropTypes.node,
  username: PropTypes.node.isRequired,
  altUsername: PropTypes.string,
  uiMeta: PropTypes.arrayOf(PropTypes.string),
  uiExtraMeta: PropTypes.arrayOf(PropTypes.string),
  online: PropTypes.bool,
  reverse: PropTypes.bool,
  onUsernameClick: PropTypes.func,
  onAvatarClick: PropTypes.func,
  AvatarCompo: PropTypes.func,
});

AvatarStampII.defaultProps = {
  namespace: defaultNamespace,
  size: "xs",
  AvatarCompo: Avatar,
  separator: AvatarStampBase.defaultProps.separator,
};

export default AvatarStampII;
