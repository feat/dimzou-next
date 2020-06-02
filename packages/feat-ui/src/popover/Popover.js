import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import { PortalWithState } from 'react-portal';
import Align from 'rc-align';
// import Align from "../align";
import SETTING from '../align/placements';

import { namespace as defaultNamespace } from '../config';

let defaultNode;
try {
  defaultNode = document.getElementById('_popover_');
  if (!defaultNode) {
    defaultNode = document.createElement('div');
    defaultNode.id = '_popover_';
    defaultNode.style.position = 'absolute';
    defaultNode.style.top = 0;
    defaultNode.style.left = 0;
    defaultNode.style.width = 0;
    // defaultNode.style.width = "100%";
    document.querySelector('body').append(defaultNode);
  }
} catch (err) {}

class Popover extends PortalWithState {
  blockName = `${this.props.namespace}-Popover`;

  componentDidUpdate() {
    this.handleBody(this.state.active);
  }

  getTarget = () => ReactDOM.findDOMNode(this.trigger);

  getChildProps() {
    const { isMobile, triggerWay } = this.props;
    if (!isMobile && triggerWay === 'hover') {
      return {
        onMouseOver: this.openPortal,
        onMouseLeave: this.closePortal,
        ref: (n) => {
          this.trigger = n;
        },
      };
    }
    return {
      onClick: this.togglePortal,
      ref: (n) => {
        this.trigger = n;
      },
    };
  }

  togglePortal = (e) => {
    if (this.props.stopPropagation) {
      e.stopPropagation();
    }
    if (!this.state.active) {
      this.openPortal(e);
    } else {
      this.closePortal(e);
    }
  };

  handleContentClick = (e) => {
    if (this.props.isMobile || this.props.stopPropagation) {
      e.stopPropagation();
    }
  };

  handleBody() {
    const bodyClassName = document.querySelector('body').classList;
    if (this.state.active && this.props.isMobile) {
      bodyClassName.add('hideScroll');
    } else {
      const modalNum = document.querySelectorAll(this.blockName).length;
      if (modalNum < 2) {
        bodyClassName.remove('hideScroll');
      }
    }
  }

  render() {
    const {
      children,
      content,
      placement,
      namespace,
      wrapWithDefaultLayer,
      isMobile,
    } = this.props;

    const { blockName } = this;

    return (
      <React.Fragment>
        {React.cloneElement(children, this.getChildProps())}
        {isMobile
          ? this.wrapWithPortal(
            <div
              className={`${namespace}-ModalContainer`}
              onClick={this.togglePortal}
            >
              <div
                className={`${namespace}-ModalWrap`}
                onClick={this.handleContentClick}
              >
                {wrapWithDefaultLayer ? (
                  <div className={blockName}>{content}</div>
                ) : (
                  content
                )}
              </div>
            </div>,
          )
          : this.wrapWithPortal(
            <Align
              onClick={this.handleContentClick}
              target={this.getTarget}
              align={SETTING[placement]}
            >
              {wrapWithDefaultLayer ? (
                <div className={blockName}>{content}</div>
              ) : (
                content
              )}
            </Align>,
          )}
      </React.Fragment>
    );
  }
}

export default Popover;

Popover.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  closeOnOutsideClick: PropTypes.bool,
  namespace: PropTypes.string,
  triggerWay: PropTypes.oneOf(['click', 'hover']),
  placement: PropTypes.oneOf(Object.keys(SETTING)),
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  wrapWithDefaultLayer: PropTypes.bool,
  isMobile: PropTypes.bool,
};

Popover.defaultProps = {
  offsetY: 4,
  offsetX: 4,
  closeOnOutsideClick: true,
  namespace: defaultNamespace,
  triggerWay: 'click',
  placement: 'topLeft',
  wrapWithDefaultLayer: true,
  stopPropagation: true,
  node: defaultNode,
};
