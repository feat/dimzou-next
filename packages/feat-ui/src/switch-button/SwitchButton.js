import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';
import Button from "../button/Button";

export default class SwitchButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: this.getIndex(props.options, props.initialValue),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initialValue !== nextProps.initialValue) {
      this.setState({
        currentIndex: this.getIndex(nextProps.options, nextProps.initialValue),
      });
    }
  }

  getIndex(options, value) {
    const index = options.findIndex((option) => option.value == value);
    return index;
  }

  handleClick = (e) => {
    e.preventDefault();
    const { currentIndex } = this.state;
    const nextIndex = (currentIndex + 1) % (this.props.options.length);
    const nextOption = this.props.options[nextIndex];
    this.setState({ currentIndex: nextIndex });
    this.props.onChange(nextOption.value, nextOption);
  }

  render() {
    const { initialValue, options, onChange, placeholder, className, ...buttonProps } = this.props;
    const { currentIndex } = this.state;

    if (options.length === 0) {
      return (<div>No Options provided</div>);
    }
    const hasValue = currentIndex > -1;
    const label = hasValue ? options[currentIndex].label : placeholder

    return (
      <Button
        {...buttonProps}
        className={classNames(className, {
          'is-placeholder': !hasValue,
        })}
        onClick={this.handleClick}
      >
        {label}
      </Button>
    );
  }
}

SwitchButton.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
  options: PropTypes.array.isRequired,
}