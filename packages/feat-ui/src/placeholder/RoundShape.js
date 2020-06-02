import React from "react";
import PropTypes from "prop-types";

export default function RoundShape(props) {
  const { size, style, className, label, ...rest } = props;
  const mergedStyle = {
    ...style,
    width: size,
    height: size,
  };
  return (
    <div
      className="ft-Placeholder ft-Placeholder_round"
      style={mergedStyle}
      {...rest}
    >
      {label && <div className="ft-Placeholder__text">{label}</div>}
    </div>
  );
}

RoundShape.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.node,
  style: PropTypes.object,
};
