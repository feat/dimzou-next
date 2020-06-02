import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import range from "lodash/range";

import { namespace as defaultNamespace } from "../config";

class DigitInput extends Component {
  state = {
    isActive: false,
  };

  componentDidUpdate() {

  }

  focus = () => {
    if (this.input) {
      this.input.focus();
    }
  };

  blur = () => {
    if (this.input) {
      this.input.blur();
    }
  };

  onChange = (e) => {
    const value = e.target.value;
    if (value.length > this.props.digitCount) {
      return false;
    }
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  getUnitContent(index) {
    const { value } = this.props;
    if (this.props.type === "password" && value[index]) {
      return "\uFF65";
    }
    return value[index];
  }

  handleInputFocus = (e) => {
    this.setState({ isActive: true });
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  };

  handleInputBlur = (e) => {
    this.setState({ isActive: false });
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  };

  handleGetFocus = () => {
    this.input.focus();
  };

  render() {
    const { type, digitCount, value, className, namespace, size } = this.props;
    const prefixClass = `${namespace}-DigitInput`;
    const units = range(digitCount);
    const { isActive } = this.state;
    return (
      <div
        ref={(n) => {
          this.dom = n;
        }}
        className={cx(className, prefixClass, `${prefixClass}_${size}`)}
      >
        <div
          className={`${prefixClass}__container`}
          onClick={this.handleGetFocus}
        >
          {units.map((unit, index) => (
            <span
              key={unit}
              className={cx({
                [`${prefixClass}__unit`]: true,
                "is-active":
                  isActive &&
                  ((value.length < digitCount && index === value.length) ||
                    (value.length === digitCount && index === digitCount - 1)),
              })}
            >
              {this.getUnitContent(index)}
            </span>
          ))}
        </div>
        <input
          ref={(node) => {
            this.input = node;
          }}
          type={type}
          value={value}
          onChange={this.onChange}
          onBlur={this.handleInputBlur}
          onFocus={this.handleInputFocus}
          autoComplete="off"
          autoFocus={this.props.autoFocus}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}

DigitInput.propTypes = {
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(["text", "password"]),
  digitCount: PropTypes.number,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  namespace: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md"]),
  autoFocus: PropTypes.bool,
};

DigitInput.defaultProps = {
  type: "text",
  digitCount: 4,
  value: "",
  size: "sm",
  namespace: defaultNamespace,
};

export default DigitInput;
