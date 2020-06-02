import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SwitchButton from '@feat/feat-ui/lib/switch-button';

class DelaySwitchButton extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    const { delay, onChange } = this.props;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      onChange(value);
    }, delay);
  }

  render() {
    const { delay, ...switchButtonProps } = this.props;
    return <SwitchButton {...switchButtonProps} onChange={this.handleChange} />;
  }
}

DelaySwitchButton.propTypes = {
  delay: PropTypes.number,
};

DelaySwitchButton.defaultProps = {
  delay: 400,
};

export default DelaySwitchButton;
