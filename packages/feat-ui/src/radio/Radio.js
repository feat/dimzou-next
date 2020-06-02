import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { namespace as defaultNamespace } from "../config";

class Radio extends Component {
  static propTypes = {
    block: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    namespace: PropTypes.string,
  }

  static defaultProps = {
    namespace: defaultNamespace,
  }

  render() {
    const { className, style, block, namespace, children, ...rest } = this.props;
    const baseName = `${namespace}-Radio`;
    return (
      <label
        className={classNames(baseName, className)}
        style={style}
      >
        <input
          type="radio"
          {...rest}
        />
        <span className="symbol" />
        {children && <span>{children}</span>}
      </label>
    );
  }
}

export default Radio;
