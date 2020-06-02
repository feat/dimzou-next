import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import Animate from 'rc-animate';

function Icon() {
  return <i />;
}

export default class Alert extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
    closable: PropTypes.bool,
    closeText: PropTypes.node,
    message: PropTypes.node.isRequired,
    description: PropTypes.node.isRequired,
    onClose: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      closing: true,
      closed: false,
    };
  }

  handleClose = (e) => {
    e.preventDefault();
    const dom = ReactDOM.findDOMNode(this);
    dom.style.height = `${dom.offsetHeight}px`;
    // Magic code
    // 重复一次后才能正确设置 height
    dom.style.height = `${dom.offsetHeight}px`;

    this.setState({
      closing: false,
    });
    (this.props.onClose || noop)(e);
  };

  animationEnd = () => {
    this.setState({
      closed: true,
      closing: true,
    });
  };

  render() {
    let {
      closable,
      description,
      type,
      prefixCls = 'ft-Alert',
      message,
      closeText,
      showIcon,
      banner,
      className = '',
      style,
    } = this.props;

    // banner模式默认有 Icon
    showIcon = banner && showIcon === undefined ? true : showIcon;
    // banner模式默认为警告
    type = banner && type === undefined ? 'warning' : type || 'info';

    let iconType = '';
    switch (type) {
      case 'success':
        iconType = 'check-circle';
        break;
      case 'info':
        iconType = 'info-circle';
        break;
      case 'error':
        iconType = 'cross-circle';
        break;
      case 'warning':
        iconType = 'exclamation-circle';
        break;
      default:
        iconType = 'default';
    }

    // use outline icon in alert with description
    if (description) {
      iconType += '-o';
    }

    const alertCls = cx(
      prefixCls,
      {
        [`${prefixCls}_${type}`]: true,
        [`${prefixCls}_close`]: !this.state.closing,
        [`${prefixCls}_withDescription`]: !!description,
        [`${prefixCls}_noIcon`]: !showIcon,
        [`${prefixCls}_banner`]: !!banner,
      },
      className,
    );

    // closeable when closeText is assigned
    if (closeText) {
      closable = true;
    }

    const closeIcon = closable ? (
      <a onClick={this.handleClose} className={`${prefixCls}__closeIcon`}>
        {closeText || <Icon type="cross" />}
      </a>
    ) : null;

    return this.state.closed ? null : (
      <Animate
        component=""
        showProp="data-show"
        transitionName={`${prefixCls}__slideUp`}
        onEnd={this.animationEnd}
      >
        <div data-show={this.state.closing} className={alertCls} style={style}>
          {showIcon ? (
            <Icon className={`${prefixCls}__icon`} type={iconType} />
          ) : null}
          <span className={`${prefixCls}__message`}>{message}</span>
          <span className={`${prefixCls}__description`}>{description}</span>
          {closeIcon}
        </div>
      </Animate>
    );
  }
}
