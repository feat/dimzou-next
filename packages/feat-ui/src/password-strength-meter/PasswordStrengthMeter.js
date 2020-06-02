import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import zxcvbn from "zxcvbn";

import { namespace as defaultNamespace } from "../config";

export default function PasswordStrengthMeter(props) {
  const { value, namespace, className, getBarStyle, getDescription, ...restProps } = props;
  const blockName = `${namespace}-PWDStrengthMeter`;

  let score;

  if (value && value.trim() !== "") {
    score = zxcvbn(value).score;
  }
  const barStyle = getBarStyle(score);
  const desc = getDescription(score);

  return (
    <div
      className={classNames(blockName, className)}
      {...restProps}
    >
      <div className={`${blockName}__barWrap`}>
        <div className={`${blockName}__bar`} style={barStyle} />
      </div>
      <div className={`${blockName}__desc`}>{desc}</div>
    </div>
  );
}

PasswordStrengthMeter.score = (value) => value && zxcvbn(value).score;

PasswordStrengthMeter.propTypes = {
  namespace: PropTypes.string,
  value: PropTypes.string,
  getBarStyle: PropTypes.func,
  getDescription: PropTypes.func,
};

PasswordStrengthMeter.defaultProps = {
  namespace: defaultNamespace,
  getBarStyle: (score) => {
    const style = {};
    const colorSchema = {
      0: "red",
      1: "red",
      2: "orange",
      3: "lightBlue",
      4: "green",
    };
    if (score !== undefined) {
      style.width = `${((score / 4) * 100).toFixed()}%`;
      style.backgroundColor = colorSchema[score];
    }
    return style;
  },
  getDescription: (score) => {
    const descriptions = {
      0: "risky",
      1: "risky",
      2: "Normal",
      3: "Safe",
      4: "Very safe",
    };
    return descriptions[score];
  },
};
