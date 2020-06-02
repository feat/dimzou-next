import React, { PureComponent } from "react";
import PropTypes, { instanceOf } from "prop-types";
import classNames from "classnames";

import { namespace as defaultNamespace } from "../config";
class FeedTemplateI extends PureComponent {
  constructor(props) {
    super(props);
    this.renderII = this.renderII.bind(this);
  }

  static maxItemCount = 10;

  static propTypes = {
    namespace: PropTypes.string,
    className: PropTypes.string,
    items(props, propName, componentName) {
      if (!(props[propName] instanceof Array)) {
        return new Error(
          `Invalid prop \`${propName}\` supplied to` +
          ` \`${componentName}\`. Validation failed.`
        );
      }
      if (props[propName].length > 10) {
        return new Error("Max Items Count: 10");
      }
    },
    itemProps: PropTypes.object,
  }

  static defaultProps = {
    namespace: defaultNamespace,
  }

  renderI(item, index) {
    return <div>renderI for Type I</div>;
  }

  renderII(item, index) {
    return <div>renderII for Type II</div>;
  }

  renderIII(item, index) {
    return <div>renderIII for Type III</div>;
  }

  renderIV(item, index) {
    return <div>renderIV for Type IV</div>;
  }

  renderV(item, index) {
    return <div>renderV for Type V</div>;
  }

  render() {
    const {
      namespace, className, items, itemProps,
      ...restProps } = this.props;
    const blockName = `${namespace}-FeedTemplate`;
    return (
      <div
        {...restProps}
        className={classNames(blockName, `${blockName}_I`, className
        )}
      >
        <div className={`${blockName}__Col1`}>
          {items[0] && this.renderI(items[0], undefined, itemProps)}
          {items.slice(1, 4).map((item, index) => (
            this.renderII(item, index, itemProps)
          ))}
        </div>
        <div className={`${blockName}__Col2`}>
          {items[4] && this.renderIII(items[4], undefined, itemProps)}
          {items.slice(5, 7).map((item, index) => (
            this.renderIV(item, index, itemProps)
          ))}
        </div>
        <div className={`${blockName}__Col3`}>
          {items.slice(7).map((item, index) => (
            this.renderV(item, index, itemProps)
          ))}
        </div>
      </div>
    );
  }
}

export default FeedTemplateI;
