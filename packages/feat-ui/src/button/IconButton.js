import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Button from "./Button";
import SvgIcon from "../svg-icon";

export default class IconButton extends Button {
  blockName = "IconButton";

  render() {
    const {
      svgIcon,
      width,
      height,
      children,
      isActive,
      htmlType,
      type,
      size,
      namespace,
      loading,
      invisible,
      ...restProps
    } = this.props;
    return (
      <button
        ref={(n) => {
          this.btn = n;
        }}
        type={htmlType}
        {...restProps}
        className={this.classnames()}
      >
        {svgIcon ? (
          <SvgIcon
            className={classNames({ "is-active": isActive })}
            icon={svgIcon}
            width={width}
            height={height}
          />
        ) : (
          children
        )}
      </button>
    );
  }
}

IconButton.propTypes = {
  namespace: PropTypes.string,
  svgIcon: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  isActive: PropTypes.bool,
  children: PropTypes.node,
  htmlType: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  type: PropTypes.string,
  invisible: PropTypes.bool,
};
