import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

const staticWidth = 114;
const staticHeight = 42;
const staticLeftCompoWidth = 25;
const staticLeftCompoHeight = 27;
const staticShadowExtraWidth = 12;
const footerHeight = 15;

// TODO Height;

const getShadowPath = (pivotX, pivotY) => {
  const x1 = pivotX + (98.64 - 113);
  const x2 = pivotX + (99.044 - 113);
  const x3 = pivotX + (103.751 - 113);
  const x4 = pivotX;
  const x5 = pivotX + (99.338 - 113);

  const y1 = pivotY + (20.458 - 27);
  const y2 = pivotY;
  const y3 = pivotY + (15.748 - 27);

  const path = `M${x1},${y3}c-0.698,0-1.181,0.931-1.178,1.525c0.004,0.668,0.435,1.42,0.786,1.958
  C${x2},${y1},${x3},${y2},${x4},${y2}c-0.916-2.197-1.094-3.977,0.826-5.644c2.219-2.218,8.681-4.19,9.776-4.552
  c-0.603-1.211-3.751-1.057-4.716-1.057S${x5},${y3},${x1},${y3}z`;
  return path;
};

export default function TabSymbol(props) {
  const { width, height, active, style, className, ...restProps } = props;
  const alpha = height / staticLeftCompoHeight;
  const totalHeight = alpha * staticHeight;
  const totalWidth = alpha * staticShadowExtraWidth + width;
  const midWidth = width / alpha - staticLeftCompoWidth - 1;

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={totalWidth}
      height={totalHeight}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      fill="white"
      stroke="#C6C6C6"
      className={classNames("ftTab", className)}
      {...restProps}
    >
      <path
        className="ftTab__shadow"
        fill="#1E1E1C"
        opacity="0.4"
        stroke="#1E1E1C"
        d={getShadowPath((width - 1) / alpha, (height - 1) / alpha)}
        transform={`scale(${alpha})`}
      />
      <path
        className="ftTab__shape"
        style={style}
        d={
          active
            ? `M0,27c7,0,12.5-6,12.5-13.5c0-7.5,5.5-13.5,12.5-13.5 H${midWidth} c7,0,12.5+6,12.5+13.5s5.5,13.5,12.5,13.5V40H0z`
            : `M0,27c7,0,12.5-6,12.5-13.5c0-7.5,5.5-13.5,12.5-13.5 H${midWidth} c7,0,12.5+6,12.5+13.5s5.5,13.5,12.5,13.5H0z`
        }
        transform={`scale(${alpha})`}
      />
    </svg>
  );
}
