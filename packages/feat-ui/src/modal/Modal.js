import React from "react";
import classsNames from "classnames";
import PropTypes from "prop-types";
import Animate from "rc-animate";
import { PortalWithState } from "react-portal";

function noop() {}

export default class Modal extends PortalWithState {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    showMask: PropTypes.bool,
    maskClosable: PropTypes.bool,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    showMask: true,
    maskClosable: false,
    onClose: noop,
    onOpen: noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      isClosing: false,
      active: props.isOpen,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.state.active) {
      if (nextProps.isOpen) {
        this.openPortal();
      } else {
        this.setState({ isClosing: true });
      }
    }
  }

  componentWillUnmount() {
    this.handleBody(false);
  }

  handleOutsideClick = (e) => {
    if (!this.props.maskClosable) {
      return false;
    }
    if (this.content.contains(e.target)) {
      return false;
    }
    this.tryToClose();
  };

  tryToClose = () => {
    this.setState({ isClosing: true });
  };

  handleBody(isOpen) {
    const bodyClassName = document.querySelector("body").classList;
    if (isOpen) {
      bodyClassName.add("hideScroll");
    } else {
      const modalNum = document.querySelectorAll(".ft-Modal").length;
      if (modalNum < 2) {
        bodyClassName.remove("hideScroll");
      }
    }
  }

  afterAnimate = () => {
    this.handleBody(false);
    if (this.state.active) {
      this.setState({
        isClosing: false,
      });
      this.closePortal();
    }
  };

  render() {
    return this.wrapWithPortal(
      <Animate
        component=""
        showProp="data-show"
        onEnd={this.afterAnimate}
        transitionName="ani-fade"
      >
        <div
          className={classsNames("ft-ModalContainer", this.props.className, {
            "ft-ModalContainer_invisible": !this.props.showMask,
          })}
          style={this.props.style}
          data-show={!this.state.isClosing}
          onClick={this.handleOutsideClick}
        >
          <div
            className="ft-ModalWrap"
            ref={(n) => {
              this.content = n;
            }}
          >
            {this.props.children}
          </div>
        </div>
      </Animate>
    );
  }
  // render() {
  //   const { className, style, children, showMask, ...rest } = this.props;
  //   const { isOpen, isClosing } = this.state;

  //   return (
  //     isOpen && (
  //       <Portal {...rest}>
  // <Animate
  //   component=""
  //   showProp="data-show"
  //   onEnd={this.afterAnimate}
  //   transitionName="ani-fade"
  // >
  //   <div
  //     className={classsNames("ft-ModalContainer", className, {
  //       "ft-ModalContainer_invisible": !showMask
  //     })}
  //     style={style}
  //     data-show={!isClosing}
  //     onClick={this.handleOutsideClick}
  //   >
  //     <div
  //       className="ft-ModalWrap"
  //       ref={n => {
  //         this.content = n;
  //       }}
  //     >
  //       {children}
  //     </div>
  //   </div>
  // </Animate>
  //       </Portal>
  //     )
  //   );
  // }
}
