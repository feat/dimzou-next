import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { namespace as defaultNamespace } from "../config";

/** Button 组件 */

class Button extends PureComponent {
  blockName = "Button";

  click = () => {
    this.btn && this.btn.click();
  };

  classnames() {
    const { namespace, className, invisible, type, size, block } = this.props;
    const { blockName } = this;
    const baseName = `${namespace}-${blockName}`;
    return classNames(className, {
      [baseName]: true,
      [`${baseName}_${type}`]: true,
      [`${baseName}_block`]: block,
      [`${baseName}_${size}`]: size,
      "is-invisible": invisible,
    });
  }

  render() {
    const {
      type,
      namespace,
      className,
      htmlType,
      size,
      invisible,
      block,
      loading,
      ...htmlProps
    } = this.props;
    return (
      <button
        ref={(n) => {
          this.btn = n;
        }}
        className={this.classnames()}
        type={htmlType}
        {...htmlProps}
      />
    );
  }
}

Button.propTypes = {
  namespace: PropTypes.string,
  className: PropTypes.string,
  /** 按钮样式 ["primary", "dashed", "danger", "default", "link", "merge", "ok", "no"] */
  type: PropTypes.oneOf([
    "primary",
    "dashed",
    "danger",
    "default",
    "link",
    "merge",
    "ok",
    "no",
    "ghost",
    'primaryOutline',
    'dangerOutline',
    'linkOutline',
  ]),
  htmlType: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  invisible: PropTypes.bool,
  loading: PropTypes.bool,
};

Button.defaultProps = {
  namespace: defaultNamespace,
  type: "default",
  size: "sm",
  htmlType: "button",
};

export default Button;
