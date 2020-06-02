import React from "react";
import PropTypes from "prop-types";

import AvatarStampI from "./AvatarStampI";
import AvatarStampII from "./AvatarStampII";

import { namespace as defaultNamespace } from "../config";

const AvatarStamp = ({ type, ...avatarProps }) => {
  switch (type) {
    case "I":
      return <AvatarStampI {...avatarProps} />;
    case "II":
      return <AvatarStampII {...avatarProps} />;
  }
};

AvatarStamp.propTypes = {
  ...AvatarStampI.propTypes,
  type: PropTypes.oneOf(["I", "II"]),
};

AvatarStamp.defaultProps = {
  namespace: defaultNamespace,
  type: "I",
  size: "xs",
};

export default AvatarStamp;
