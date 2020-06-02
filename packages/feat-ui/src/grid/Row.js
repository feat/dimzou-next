import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { defaultGutterArray } from "./config";

// TODO alignment classNames
export default function Row(props) {
  const { className, style, flex, children, divisionBy, gutter, justify, align, wrap, ...others } = props;
  const hasDefaultGutterStyle = defaultGutterArray.indexOf(gutter) > -1;

  const baseName = flex ? "FlexRow" : "Row";
  const classConfig = {};

  if (className) {
    classConfig[className] = true;
  }
  classConfig[`ft-${baseName}`] = true;
  classConfig[`ft-${baseName}_gutterOffset_${gutter / 2}`] = hasDefaultGutterStyle;

  if (flex) {
    classConfig[`ft-${baseName}_spaceBetween`] = justify === "space-between";
    classConfig[`ft-${baseName}_spaceAround`] = justify === "space-around";
    classConfig[`ft-${baseName}_center`] = justify === "center";
    classConfig[`ft-${baseName}_top`] = align === "top";
    classConfig[`ft-${baseName}_middle`] = align === "middle";
    classConfig[`ft-${baseName}_bottom`] = align === "bottom";
    classConfig[`ft-${baseName}_wrap`] = wrap;
  }

  const rowStyle = (gutter > 0 && !hasDefaultGutterStyle) ? Object.assign({}, {
    marginLeft: gutter / -2,
    marginRight: gutter / -2,
  }, style) : style;

  return (
    <div
      {...others}
      className={classNames(classConfig)}
      style={rowStyle}
    >
      {React.Children.map(children, (col) => {
        if (!col) return null;
        if (col.props && col.type.displayName === "Col") {
          return React.cloneElement(col, {
            gutter,
            divisionBy,
            flex,
          });
        }
        return col;
      })}
    </div>
  );
}

Row.defaultProps = {
  divisionBy: 24,
  gutter: 0,
};

Row.propTypes = {
  divisionBy: PropTypes.number,
  wrap: PropTypes.bool,
  flex: PropTypes.bool,
  align: PropTypes.string,
  justify: PropTypes.string,
  children: PropTypes.node,
  gutter: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};
