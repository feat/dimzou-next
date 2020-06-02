import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function ButtonGroup(props) {
  const { className, children, block, ...otherProps } = props;
  return (
    <div
      className={classNames(className, {
        "ft-ButtonGroup": true,
        "ft-ButtonGroup_block": block,
      })}
      {...otherProps}
    >
      {children}
    </div>
  );
}

ButtonGroup.propTypes = {
  block: PropTypes.bool,
};
