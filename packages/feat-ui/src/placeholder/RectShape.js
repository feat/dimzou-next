import React from "react";
import PropTypes from "prop-types";

export default function RectShape(props) {
  const { ratio, label, style, width = "100%", ...rest } = props;
  const parseWidth = parseInt(width, 10);

  const paddingTop =
    props.height ||
    (ratio && parseWidth / ratio + (parseWidth == width ? "px" : "%"));
  const mergedStyle = {
    width,
    paddingTop,
    ...style,
  };

  return (
    <div
      className="ft-Placeholder ft-Placeholder_rect"
      style={mergedStyle}
      {...rest}
    >
      {label && <div className="ft-Placeholder__label">{label}</div>}
    </div>
  );
}

RectShape.propTypes = {
  ratio: PropTypes.number,
  label: PropTypes.node,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  style: PropTypes.object,
};
