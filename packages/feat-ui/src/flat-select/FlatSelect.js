import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { Col, Row } from "../grid";
import Button from "../button/Button";

export default class FlatSelect extends Component {
  static propTypes = {
    gridSpan: PropTypes.number,
    gutter: PropTypes.number,
    divisionBy: PropTypes.number,
    flex: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(String),
    ]),
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(String),
    ]),
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    notAllowed: PropTypes.arrayOf(String),
  };

  static defaultProps = {
    notAllowed: [],
    divisionBy: 24,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue,
    };
  }

  getValue() {
    if (this.props.defaultValue) {
      return this.state.value;
    }
    return this.props.value;
  }

  handleChange = (value) => {
    const { multiple } = this.props;
    if (multiple) {
      this.handleMultiChange(value);
    } else {
      this.handleSingleChange(value);
    }
  }

  handleSingleChange(value) {
    this.setState({ value });
    this.props.onChange(value);
  }

  handleMultiChange(value) {
    let oldValue;
    if (this.props.defaultValue) {
      oldValue = this.state.value;
    } else {
      oldValue = this.props.value;
    }
    let newValue;
    if (oldValue.indexOf(value) > -1) {
      newValue = oldValue.filter((v) => v !== value);
    } else {
      newValue = [...oldValue, value];
    }
    this.setState({ value: newValue });
    this.props.onChange(newValue);
  }

  renderOptions() {
    const { gridSpan, notAllowed, options, optionClassName, multiple } = this.props;
    const value = this.getValue();
    return options.map((option) => {
      const isSelected = multiple ? value.indexOf(option.value) > -1 : value === option.value;
      const isDisabled = (!isSelected && notAllowed.indexOf(option.value) > -1) || option.disabled;
      const compo = (
        <Button
          key={option.value}
          block
          type="merge"
          className={cx(optionClassName, {
            "is-selected": isSelected,
          })}
          disabled={isDisabled}
          onClick={(e) => {
            e.preventDefault();
            this.handleChange(option.value, option);
          }}
        >
          {option.label}
        </Button>
      );

      if (gridSpan !== undefined) {
        return <Col span={gridSpan} key={option.value}>{compo}</Col>;
      }

      return compo;
    });
  }

  renderOption(child) {
    const { gridSpan, notAllowed, multiple } = this.props;
    const value = this.getValue();
    const isSelected = multiple ? value.indexOf(child.props.value) > -1 : value === child.props.value;
    const isDisabled = (!isSelected && notAllowed.indexOf(child.props.value) > -1) || child.props.disabled;

    const option = React.cloneElement(child, {
      className: cx(child.props.className, {
        "is-selected": isSelected,
      }),
      disabled: isDisabled,
      onClick: (e) => {
        e.preventDefault();
        this.handleChange(child.props.value);
      },
    });

    if (gridSpan !== undefined) {
      return <Col span={gridSpan} key={child.key}>{option}</Col>;
    }

    return option;
  }

  render() {
    const { children, onChange,
      notAllowed, gutter,
      divisionBy, flex,
      className,
      options,
    } = this.props;
    return (
      <Row
        className={className}
        divisionBy={divisionBy}
        gutter={gutter}
        flex={flex}
        wrap={flex}
      >
        {options ? this.renderOptions() : (
          React.Children.map(children, (child) => {
            if (!child) return null;
            return this.renderOption(child);
          })
        )}
      </Row>
    );
  }
}
