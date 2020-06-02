import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function FlexCol(props) {
  const { className, children, justify, align, ...restProps } = props;
  const classConfig = {};

  if (className) {
    classConfig[className] = true;
  }

  classConfig["ft-FlexColumn"] = true;
  classConfig["ft-FlexColumn_spaceBetween"] = justify === "space-between";
  classConfig["ft-FlexColumn_spaceAround"] = justify === "space-around";
  classConfig["ft-FlexColumn_center"] = justify === "center";
  classConfig["ft-FlexColumn_top"] = align === "left";
  classConfig["ft-FlexColumn_middle"] = align === "center";
  classConfig["ft-FlexColumn_bottom"] = align === "right";

  return (
    <div
      className={classNames(classConfig)}
      {...restProps}
    >
      {children}
    </div>
  );
}

FlexCol.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  justify: PropTypes.oneOf(["space-between", "space-around", "center"]),
  align: PropTypes.oneOf(["left", "center", "right"]),
};
