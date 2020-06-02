import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import classNames from "classnames";

export default function floatLabel(Compo) {
  class Wrapped extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isFocused: false,
      };
      this.focus = this.focus.bind(this);
      this.focusListener = () => { this.setState({ isFocused: true }); };
      this.blurListener = () => { this.setState({ isFocused: false }); };
    }

    componentDidMount() {
      const selfDOM = ReactDOM.findDOMNode(this);
      const inputDOM = selfDOM.querySelector("input") || selfDOM.querySelector("textarea");
      if (!inputDOM) return;
      this.inputDOM = inputDOM;
      this.inputDOM.addEventListener("blur", this.blurListener);
      this.inputDOM.addEventListener("focus", this.focusListener);
    }

    componentWillUnmount() {
      if (!this.inputDOM) return;
      this.inputDOM.removeEventListener("blur", this.blurListener);
      this.inputDOM.removeEventListener("focus", this.focusListener);
    }

    focus(e) {
      e && e.preventDefault();
      this.inputDOM && this.inputDOM.focus();
    }

    reset() {
      this.compo.reset && this.compo.reset();
    }

    render() {
      const { label, labelStyle, labelClassName, className, ...restProps } = this.props;
      const { isFocused } = this.state;
      return (
        <div
          className={classNames("ft-FloatLabelGroup", className, {
            "is-empty": restProps.value === "",
            "is-focused": isFocused,
          })}
          onClick={this.focus}
        >
          <label
            className={classNames("ft-FloatLabelGroup__label", labelClassName)}
            style={labelStyle}
          >
            {label}
          </label>
          <div className="ft-FloatLabelGroup__container">
            <Compo
              {...restProps}
              ref={(c) => { this.compo = c; }}
            />
          </div>
        </div>
      );
    }
  }

  const compoDisplayName = typeof Compo === "string" ? Compo : Compo.displayName;
  Wrapped.displayName = `FloatLabel(${compoDisplayName})`;

  Wrapped.propTypes = {
    label: PropTypes.node,
    labelStyle: PropTypes.object,
    labelClassName: PropTypes.string,
  }

  return Wrapped;
}
