import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import classNames from "classnames";
import Button from "@feat/feat-ui/lib/button";
import CrossSymbol from "./CrossSymbol";

class CrossButton extends Component {
  state = {};

  componentDidMount() {
    this.setBoxSize();
    window.addEventListener("resize", this.setBoxSize, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setBoxSize, false);
  }

  setBoxSize = () => {
    const buttonDom = ReactDOM.findDOMNode(this);
    const box = buttonDom.getBoundingClientRect();
    this.setState({
      box: {
        width: box.width,
        height: box.height,
      },
    });
  };

  render() {
    const { className, ...buttonProps } = this.props;
    return (
      <Button
        className={classNames("ft-CrossButton", className)}
        {...buttonProps}
      >
        {this.props.children}
        {this.state.box ? <CrossSymbol {...this.state.box} /> : null}
      </Button>
    );
  }
}

CrossButton.defaultProps = {
  style: { position: "relative" },
};

CrossButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default CrossButton;
