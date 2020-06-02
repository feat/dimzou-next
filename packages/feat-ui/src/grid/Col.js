import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { basename } from "path";
import { defaultGutterArray } from "./config";

export default function Col(props) {
  const {
    xs,
    sm,
    md,
    lg,
    divisionBy,
    flex,
    className,
    style,
    span,
    gutter,
    auto,
    offset,
    ...others
  } = props;

  const hasDefaultGutterStyle = defaultGutterArray.indexOf(gutter) > -1;

  const baseName = flex ? "FlexCell" : "Cell";
  const classConfig = {};

  if (className) {
    classConfig[className] = true;
  }
  classConfig[`ft-${baseName}_xs_${xs}`] = !!xs;
  classConfig[`ft-${baseName}_sm_${sm}`] = !!sm;
  classConfig[`ft-${baseName}_md_${md}`] = !!md;
  classConfig[`ft-${baseName}_lg_${lg}`] = !!lg;
  classConfig[`ft-${baseName}`] = true;
  classConfig[`ft-${baseName}_${span}of${divisionBy}`] = !!span;
  classConfig[
    `ft-${baseName}_gutterOffset_${gutter / 2}`
  ] = hasDefaultGutterStyle;

  if (offset) {
    classConfig[`ft-${baseName}_offset_${offset}of${divisionBy}`] = true;
  }

  if (flex) {
    if (!span) {
      classConfig[`ft-${baseName}_auto`] = auto;
    }
  }

  const cellStyle =
    gutter > 0 && !hasDefaultGutterStyle
      ? Object.assign(
        {},
        {
          paddingLeft: gutter / 2,
          paddingRight: gutter / 2,
        },
        style
      )
      : style;

  return (
    <div {...others} className={classNames(classConfig)} style={cellStyle}>
      {props.children}
    </div>
  );
}

Col.displayName = "Col";

Col.propTypes = {
  span: PropTypes.number,
  offset: PropTypes.number,
};
