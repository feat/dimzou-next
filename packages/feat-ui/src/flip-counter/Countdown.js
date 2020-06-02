import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Flipper from './Flipper';

import { namespace as defaultNamespace } from '../config';
import Base from './Base';

class FlipCountdown extends Base {
  /**
   * Render Flipper component for each digit of diff object vals
   * @return {ReactElement} markup
   */
  render() {
    const forks = {
      days: [[0, 9], [0, 9], [0, 9]],
      hours: [[0, 2], [0, 4]],
      minutes: [[0, 5], [0, 9]],
      seconds: [[0, 5], [0, 9]],
    };

    const { namespace, size, className, slotTitle } = this.props;
    const blockName = `${namespace}-FlipCountdown`;

    return (
      <div className={classNames(blockName, `${blockName}_${size}`, className)}>
        {this.getDigits().map((key) => {
          const slotCount =
            key === 'days' ? Math.max(2, `${this.state.diff[key]}`.length) : 2;
          return (
            <div
              key={key}
              className={`${blockName}__slot ${blockName}__${key}`}
            >
              {[...new Array(slotCount)].map((_, i) => (
                <Flipper
                  key={`${key}${i}`}
                  reverse
                  size={size}
                  now={+this.getFormattedVal(this.state.diff[key])[i]}
                  min={forks[key][i][0]}
                  max={forks[key][i][1]}
                />
              ))}
              {slotTitle && size !== 'sm' && (
                <div className={`${blockName}__slotTitle`}>{key}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

const showCompos = ['days', 'hours', 'minutes', 'seconds'];

FlipCountdown.propTypes = {
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
  slotTitle: PropTypes.bool,
  onStart: PropTypes.func,
  onStop: PropTypes.func,
};

FlipCountdown.defaultProps = {
  namespace: defaultNamespace,
  size: 'md',
  stop: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
  show: showCompos,
  slotTitle: true,
};

export default FlipCountdown;
