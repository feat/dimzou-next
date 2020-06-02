import React, { Component, cloneElement } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { namespace as defaultNamespace } from "../config";
import Checkbox from "./Checkbox";

export default class CheckboxGroup extends React.Component {
  static propTypes = {
    options: PropTypes.object,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array,
    defaultValue: PropTypes.array,
    namespace: PropTypes.string,
    blockName: PropTypes.string,
  }

  static childContextTypes = {
    checkboxGroup: PropTypes.object,
    namespace: defaultNamespace,
    blockName: "CheckboxGroup",
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue || [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if ("value" in nextProps) {
      this.setState({
        value: nextProps.value || [],
      });
    }
  }

  getChildContext() {
    return {
      checkboxGroup: {
        toggleOption: this.toggleOption,
        value: this.state.value,
        disabled: this.props.disabled,
      },
    };
  }

  getOptions() {
    const { options } = this.props;
    return options.map((option) => {
      if (typeof option === "string") {
        return {
          label: option,
          value: option,
        };
      }
      return option;
    });
  }

  toggleOption = (option) => {
    const optionIndex = this.state.value.indexOf(option.value);
    const value = [...this.state.value];
    if (optionIndex === -1) {
      value.push(option.value);
    } else {
      value.splice(optionIndex, 1);
    }
    if (!("value" in this.props)) {
      this.setState({ value });
    }
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value);
    }
  }

  render() {
    const { className, blockName, namespace } = this.props;
    let { children } = this.props;
    if (!children) {
      children = this.getOptions().map((option) => (
        <Checkbox
          disabled={"disabled" in option ? option.disabled : this.props.disabled}
          checked={this.state.value.indexOf(option.value) !== -1}
          onChange={() => this.toggleOption(option)}
          key={option.value}
        >
          {option.label}
        </Checkbox>
      ));
    }

    return (
      <div className={cx(`${namespace}-${blockName}`, className)}>
        {children}
      </div>
    );
  }
}
