import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { namespace as defaultNamespace } from '../config';

class CountdownBase extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = this.getStateObj();
  }

  /**
   * Create second interval
   */
  componentDidMount() {
    this.props.onStart && this.props.onStart();
    this.interval = window.setInterval(() => this.updateTime(), 1000);
  }

  /**
   * Destroy second interval
   */
  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  /**
   * Calculate diff object between stop and current date
   * @return {Object} formatted value
   */
  getDiffObject() {
    const ms = Math.abs(this.props.stop - new Date().getTime());

      
    const s = Math.floor(ms / 1000);

      
    const m = Math.floor(s / 60);

      
    const h = Math.floor(m / 60);

    return {
      expired: this.props.stop <= new Date().getTime(),
      rest: {
        days: Math.floor(h / 24),
        hours: h % 24,
        minutes: m % 60,
        seconds: s % 60,
      },
    };
  }

  /**
   * Return state object
   * @return {object}
   */
  getStateObj() {
    const diff = this.getDiffObject();

    return {
      diff: diff.rest,
      run: !diff.expired,
    };
  }

  /**
   * Update state with calcualted diff object
   */
  updateTime() {
    this.setState(this.getStateObj(), () => {
      if (!this.state.run) {
        window.clearInterval(this.interval);
        this.props.onStop && this.props.onStop();
      }
    });
  }

  /**
   * Returns formated to 2 digits string
   * @param {Number} data - raw value
   * @return {String} formatted value
   */
  getFormattedVal(data) {
    return `${data < 10 ? `0${data}` : data}`;
  }

  /**
   * Returns digits to be shown
   * @return {array} formatted value
   */
  getDigits() {
    return Object.keys(this.state.diff).filter(
      (key) => this.props.show.indexOf(key) >= 0,
    );
  }

  /**
   * Render Flipper component for each digit of diff object vals
   * @return {ReactElement} markup
   */
  render() {
    const { namespace, className } = this.props;
    const blockName = `${namespace}-CountdownBase`;
    const digits = this.getDigits();

    return (
      <div className={classNames(blockName, className)}>
        {digits.map((key) => {
          const diff = this.state.diff[key];
          return (
            <div className={`${blockName}__slot`}>
              {this.getFormattedVal(diff)}
            </div>
          );
        })}
      </div>
    );
  }
}

const showCompos = ['days', 'hours', 'minutes', 'seconds'];

CountdownBase.propTypes = {
  namespace: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  stop: PropTypes.instanceOf(Date),
  show: PropTypes.arrayOf(
    (propValue, key, componentName, location, propFullName) => {
      if (!showCompos.includes(propValue[key])) {
        return new Error(
          `Invalid prop ${propFullName} supplied to ${componentName}. Optional values: [${showCompos.join(
            ', ',
          )}]`,
        );
      }
    },
  ),
  onStart: PropTypes.func,
  onStop: PropTypes.func,
};

CountdownBase.defaultProps = {
  namespace: defaultNamespace,
  size: 'md',
  stop: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
  show: showCompos,
  slotTitle: true,
};

export default CountdownBase;
