import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Animate from 'rc-animate';
import ScrollNumber from './ScrollNumber';

import { namespace as defaultNamespace } from '../config';

export default class Badge extends React.Component {
  static defaultProps = {
    namespace: defaultNamespace,
    count: null,
    showZero: false,
    size: 'md',
    dot: false,
    overflowCount: 99,
  };

  static propTypes = {
    namespace: PropTypes.string,
    count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    showZero: PropTypes.bool,
    size: PropTypes.oneOf(['sm', 'md']),
    dot: PropTypes.bool,
    overflowCount: PropTypes.number,
  };

  render() {
    const {
      count,
      showZero,
      namespace,
      overflowCount,
      className,
      style,
      children,
      dot,
      status,
      text,
      size,
      ...restProps
    } = this.props;

    const blockName = `${namespace}-Badge`;

    const isDot = dot || status;
    let displayCount = count > overflowCount ? `${overflowCount}+` : count;
    // dot mode don't need count
    if (isDot) {
      displayCount = '';
    }

    const isZero = displayCount === '0' || displayCount === 0;
    const isEmpty =
      displayCount === null ||
      displayCount === undefined ||
      displayCount === '';
    const hidden = (isEmpty || (isZero && !showZero)) && !isDot;
    const scrollNumberCls = classNames({
      [`${blockName}__dot`]: isDot,
      [`${blockName}__count`]: !isDot,
    });
    const badgeCls = classNames(className, blockName, `${blockName}_${size}`, {
      [`${blockName}_status`]: !!status,
      [`${blockName}_notAWrapper`]: !children,
    });

    // <Badge status="success" />
    if (!children && status) {
      const statusCls = classNames({
        [`${blockName}__status_dot`]: !!status,
        [`${blockName}__status_${status}`]: true,
      });
      return (
        <span className={badgeCls}>
          <span className={statusCls} />
          <span className={`${blockName}__statusText`}>{text}</span>
        </span>
      );
    }

    const scrollNumber = hidden ? null : (
      <ScrollNumber
        data-show={!hidden}
        className={scrollNumberCls}
        size={size}
        count={displayCount}
        style={style}
      />
    );

    const statusText =
      hidden || !text ? null : (
        <span className={`${blockName}__statusText`}>{text}</span>
      );

    return (
      <span {...restProps} className={badgeCls} title={count}>
        {children}
        <Animate
          component=""
          showProp="data-show"
          transitionName={children ? `${blockName}_zoom` : ''}
          transitionAppear
        >
          {scrollNumber}
        </Animate>
        {statusText}
      </span>
    );
  }
}
