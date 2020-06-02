import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@feat/feat-ui/lib/button';

class CountDownButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countingDown: false,
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  start() {
    this.setState({
      countingDown: true,
      left: this.props.count,
    });
    this.tick();
  }

  tick() {
    this.timer = setTimeout(() => {
      const newLeft = this.state.left - 1;
      if (newLeft === 0) {
        this.setState({
          countingDown: false,
          left: 0,
        });
      } else {
        this.setState({
          left: newLeft,
        });
        this.tick();
      }
    }, 1000);
  }

  render() {
    const { left, countingDown } = this.state;
    const {
      children,
      count,
      renderCountDown,
      disabled,
      ...buttonProps
    } = this.props;
    return (
      <Button
        className="CountDownButton"
        htmlType="button"
        {...buttonProps}
        disabled={countingDown || disabled}
      >
        {!countingDown ? children : renderCountDown(left)}
      </Button>
    );
  }
}

CountDownButton.propTypes = {
  count: PropTypes.number,
  renderCountDown: PropTypes.func,
  disabled: PropTypes.bool,
};

CountDownButton.defaultProps = {
  count: 60,
  renderCountDown: (left) => `${left}s`,
};

export default CountDownButton;
