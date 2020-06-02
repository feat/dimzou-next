import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { namespace as defaultNamespace } from "../config";

class FormItem extends Component {
  state = { hasFocus: false };

  baseName = `${this.props.namespace}-FormItem`;

  handleFocus = () => {
    this.setState({
      hasFocus: true,
    });
  };

  handleBlur = () => {
    this.setState({
      hasFocus: false,
      blurTime: Date.now(),
    });
  };

  bindWidget = (node) => {
    this.widget = node;
  };

  tryToFocusWidget = () => {
    if (
      this.widget &&
      this.widget.focus &&
      (!this.state.blurTime || Date.now() - this.state.blurTime > 500)
    ) {
      this.widget.focus();
    }
  };

  renderLabel() {
    const { baseName } = this;
    if (this.props.renderLabel) {
      return (
        <div className={`${baseName}__label`} onClick={this.tryToFocusWidget}>
          {this.props.renderLabel(this.state, this.props.help)}
        </div>
      );
    }
    if (this.props.label) {
      return (
        <div className={`${baseName}__label`} onClick={this.tryToFocusWidget}>
          {this.props.label}
          {this.props.help}
        </div>
      );
    }
  }

  renderChildren() {
    const { children } = this.props;
    if (children instanceof Function) {
      return children.call(this, {
        handleFocus: this.handleFocus,
        handleBlur: this.handleBlur,
        hasFocus: this.state.hasFocus,
        bindWidget: this.bindWidget,
      });
    }
    return children;
  }

  render() {
    const {
      label,
      renderLabel,
      validateStatus,
      style,
      className,
      modifier,
      help,
    } = this.props;
    const { baseName } = this;
    return (
      <div
        className={classNames(baseName, className, {
          [`${baseName}_noLabel`]: !label,
          [`${baseName}_${modifier}`]: modifier,
          "has-focus": this.state.hasFocus,
          [`has-${validateStatus}`]: validateStatus,
        })}
        style={style}
      >
        {this.renderLabel()}
        <div className={`${baseName}__widget`}>{this.renderChildren()}</div>
        {!label && !renderLabel && help}
      </div>
    );
  }
}

FormItem.propTypes = {
  label: PropTypes.node,
  help: PropTypes.node,
  validateStatus: PropTypes.oneOf(["success", "warning", "error"]),
  modifier: PropTypes.string,
  namespace: PropTypes.string,
};

FormItem.defaultProps = {
  namespace: defaultNamespace,
};

export default FormItem;
