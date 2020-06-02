import React from "react";
import PropTypes from "prop-types";
import Button from "../button";

function noop() {}

class CountDownButton extends React.Component {
  state = this.getInitState();

  componentDidMount() {
    if (this.props.left && this.props.left > 0) {
      this.tick();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  getInitState() {
    if (this.props.left && this.props.left > 0) {
      return {
        countingDown: true,
        left: this.props.left,
      };
    }
    return {
      countingDown: false,
    };
  }

  start = () => {
    this.setState({ countingDown: true, left: this.props.left || this.props.count });
    this.tick();
    this.props.onStart();
  }

  tick() {
    this.timer = setTimeout(() => {
      const newLeft = this.state.left - 1;
      if (newLeft === 0) {
        this.setState({
          countingDown: false,
          left: 0,
        });
        this.props.onEnd();
      } else {
        this.setState({
          left: newLeft,
        });
        this.tick();
      }
    }, 1000);
  }

  render() {
    const { left: countingLeft, countingDown } = this.state;
    const { children, count, renderCountDown, disabled, onStart, onEnd, left, disabledWhenCountingDown, ...buttonProps } = this.props;
    return (
      <Button
        htmlType="button"
        {...buttonProps}
        disabled={(disabledWhenCountingDown && countingDown) || disabled}
      >
        { !countingDown ? children : renderCountDown(countingLeft) }
      </Button>
    );
  }
}

CountDownButton.propTypes = {
  count: PropTypes.number,
  renderCountDown: PropTypes.func,
  onStart: PropTypes.func,
  onEnd: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  left: PropTypes.number,
  disabledWhenCountingDown: PropTypes.bool,
}

CountDownButton.defaultProps = {
  count: 60,
  renderCountDown: (left) => `${left}s`,
  onStart: noop,
  onEnd: noop,
  disabledWhenCountingDown: true,
};

export default CountDownButton;