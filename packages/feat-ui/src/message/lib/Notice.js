import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { namespace } from "../../config";

export default class Notice extends Component {
  static propTypes = {
    duration: PropTypes.number,
    onClose: PropTypes.func,
    children: PropTypes.any,
    update: PropTypes.bool,
    closeIcon: PropTypes.node,
  };

  static defaultProps = {
    onEnd() {
    },
    onClose() {
    },
    namespace,
    duration: 1.5,
    style: {
      right: "50%",
    },
  };

  componentDidMount() {
    this.startCloseTimer();
  }

  componentDidUpdate(prevProps) {
    if (this.props.duration !== prevProps.duration
      || this.props.update) {
      this.restartCloseTimer();
    }
  }

  componentWillUnmount() {
    this.clearCloseTimer();
  }

  close = (e) => {
    if (e) {
      e.stopPropagation();
    }
    this.clearCloseTimer();
    this.props.onClose();
  }

  startCloseTimer = () => {
    if (this.props.duration) {
      this.closeTimer = setTimeout(() => {
        this.close();
      }, this.props.duration * 1000);
    }
  }

  clearCloseTimer = () => {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  restartCloseTimer() {
    this.clearCloseTimer();
    this.startCloseTimer();
  }

  render() {
    const props = this.props;
    const componentClass = `${props.namespace}-${props.blockName}`;
    const className = {
      [props.className]: !!props.className,
      [`${componentClass}`]: 1,
      [`${componentClass}_closable`]: props.closable,
      [`${componentClass}_${props.type}`]: true,
    };
    return (
      <div 
        className={classNames(className)} 
        style={props.style}
        onMouseEnter={this.clearCloseTimer}
        onMouseLeave={this.startCloseTimer}
        onClick={props.onClick}
      >
        <div className={`${componentClass}__content`}>{props.children}</div>
        {props.closable ?
          <a tabIndex="0" onClick={this.close} className={`${componentClass}__close`}>
            {props.closeIcon || <span className={`${componentClass}__close-x`}/>}
          </a> : null
        }
      </div>
    );
  }
}
