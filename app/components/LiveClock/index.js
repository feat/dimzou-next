import React from 'react';
import PropTypes from 'prop-types';

import { localTimeForTimezone } from '@/utils/time';

export default class ReactLiveClock extends React.Component {
  componentDidMount() {
    if (this.props.ticking) {
      this.tickTimer = setInterval(() => {
        this.forceUpdate();
      }, this.props.interval);
    }
  }

  componentWillUnmount() {
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
    }
  }

  render() {
    const { className, format, timezone } = this.props;

    const formattedTime = localTimeForTimezone(timezone, format);

    return <time className={className}>{formattedTime}</time>;
  }
}

ReactLiveClock.propTypes = {
  className: PropTypes.string,
  ticking: PropTypes.bool,
  interval: PropTypes.number,
  format: PropTypes.string,
  timezone: PropTypes.string,
};

ReactLiveClock.defaultProps = {
  className: null,
  format: 'HH:mm',
  interval: 1000,
  ticking: false,
  timezone: null,
};
