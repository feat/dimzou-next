import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { namespace as defaultNamespace } from "../config";

class FormInput extends Component {
  static propTypes = {
    namespace: PropTypes.string,
    className: PropTypes.string,
    addonBefore: PropTypes.node,
    addonAfter: PropTypes.node,
    prefix: PropTypes.node,
    suffix: PropTypes.node,
    modifier: PropTypes.string,
  };

  static defaultProps = {
    namespace: defaultNamespace,
  };

  focus() {
    this.inputDom && this.inputDom.focus();
  }

  blur() {
    this.inputDom && this.inputDom.blur();
  }

  render() {
    const {
      className,
      namespace,
      addonBefore,
      addonAfter,
      prefix,
      suffix,
      modifier,
      ...restProps
    } = this.props;
    const blockName = `${namespace}-FormInput`;
    const widgetBlockName = `${namespace}-FormInputWidget`;
    const groupBlockName = `${namespace}-FormInputAddonGroup`;

    const inputCls = cx(blockName, className, {
      [`${blockName}_${modifier}`]: modifier,
    });

    let input = (
      <input
        ref={(n) => {
          this.inputDom = n;
        }}
        className={inputCls}
        {...restProps}
      />
    );

    if (prefix || suffix) {
      input = (
        <div className={widgetBlockName}>
          {prefix && (
            <span className={`${widgetBlockName}__prefix`}>{prefix}</span>
          )}
          {input}
          {suffix && (
            <span className={`${widgetBlockName}__suffix`}>{suffix}</span>
          )}
        </div>
      );
    }

    if (addonBefore || addonAfter) {
      input = (
        <div className={groupBlockName}>
          {addonBefore && (
            <span className={`${groupBlockName}__before`}>{addonBefore}</span>
          )}
          {input}
          {addonAfter && (
            <span className={`${groupBlockName}__after`}>{addonAfter}</span>
          )}
        </div>
      );
    }

    return input;
  }
}

export default FormInput;
