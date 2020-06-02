import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { namespace as defaultNamespace } from "../config";

function noop() {}

export default class Switch extends React.Component {
  state = {
    isOpen: this.props.isOpen,
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.isOpen !== nextProps.isOpen) {
      this.setState({ isOpen: nextProps.isOpen });
    }
  }

  toggleSwitch = (e) => {
    this.setState({ isOpen: !this.state.isOpen });
    this.props.onChange(!this.state.isOpen);
  };

  render() {
    const { isOpen } = this.state;
    const { namespace, onLabel, offLabel } = this.props;
    const baseName = `${namespace}-SwitchToggle`;
    return (
      <span
        className={cx(baseName, { "is-checked": isOpen })}
        onClick={this.toggleSwitch}
      >
        <span className={`${baseName}__inner`}>
          {isOpen ? onLabel : offLabel}
        </span>
      </span>
    );
  }
}

Switch.propTypes = {
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
  namespace: PropTypes.string,
  onLabel: PropTypes.node,
  offLabel: PropTypes.node,
};

Switch.defaultProps = {
  namespace: defaultNamespace,
  isOpen: false,
  onChange: noop,
  onLabel: "on",
  offLabel: "off",
};
