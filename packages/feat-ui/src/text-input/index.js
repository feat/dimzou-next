import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { namespace as defaultNamespace } from "../config";

class TextInput extends Component {
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
      size,
      block,
      ...restProps
    } = this.props;
    const blockName = `${namespace}-TextInput`;

    const inputCls = cx(blockName, `${blockName}_${size}`, className, {
      [`${blockName}_block`]: block,
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
      const widgetBlockName = `${namespace}-TextInputWidget`;

      input = (
        <div
          className={cx(widgetBlockName, `${widgetBlockName}_${size}`, {
            "has-prefix": prefix,
            "has-suffix": suffix,
            [`${widgetBlockName}_block`]: block,
          })}
        >
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
      const groupBlockName = `${namespace}-TextInputAddonGroup`;
      input = (
        <div
          className={cx(
            groupBlockName,
            `${groupBlockName}_${size}`,
            this.props.wrapperClassName,
            {
              [`${groupBlockName}_block`]: block,
            }
          )}
        >
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

TextInput.propTypes = {
  namespace: PropTypes.string,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  addonBefore: PropTypes.node,
  addonAfter: PropTypes.node,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  modifier: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  block: PropTypes.bool,
};

TextInput.defaultProps = {
  namespace: defaultNamespace,
  size: "sm",
};

export default TextInput;
