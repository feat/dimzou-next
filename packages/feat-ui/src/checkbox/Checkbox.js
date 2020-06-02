import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { namespace as defaultNamespace } from "../config";

class Checkbox extends Component {
  static propTypes = {
    block: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    namespace: PropTypes.string,
    blockName: PropTypes.string,
  };

  static defaultProps = {
    namespace: defaultNamespace,
    blockName: "Checkbox",
  };

  static contextTypes = {
    checkboxGroup: PropTypes.object,
  };

  render() {
    const {
      className,
      style,
      block,
      children,
      namespace,
      blockName,
      ...restProps
    } = this.props;
    const { checkboxGroup } = this.context;
    const baseName = `${namespace}-${blockName}`;
    if (checkboxGroup) {
      restProps.onChange = () => {
        checkboxGroup.toggleOption(restProps);
      };
      restProps.checked = checkboxGroup.value.indexOf(restProps.value) !== -1;
      restProps.disabled =
        "disabled" in restProps ? restProps.disabled : checkboxGroup.disabled;
    }

    return (
      <label
        className={cx(baseName, { [`${baseName}_block`]: block }, className)}
        style={style}
      >
        <input type="checkbox" {...restProps} />
        <span className="symbol" />
        {children && <span className={`${baseName}__label`}>{children}</span>}
      </label>
    );
  }
}

export default Checkbox;
