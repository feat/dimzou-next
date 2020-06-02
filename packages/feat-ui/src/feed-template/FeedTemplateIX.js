import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { namespace as defaultNamespace } from "../config";

class FeedTemplateIX extends PureComponent {
  static maxItemCount = 3;

  static propTypes = {
    namespace: PropTypes.string,
    className: PropTypes.string,
    items: PropTypes.array,
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

  render() {
    const { namespace, className, items, itemProps, ...restProps } = this.props;
    const blockName = `${namespace}-FeedTemplate`;
    return (
      <div
        {...restProps}
        className={classNames(blockName, `${blockName}_IX`, className)}
      >
        <div className={`${blockName}__Col1`}>
          {items[0] && this.renderI(items[0], undefined, itemProps)}
        </div>
        <div className={`${blockName}__Col2`}>
          {items[1] && this.renderII(items[1], undefined, itemProps)}
          {items[2] && this.renderIII(items[2], undefined, itemProps)}
        </div>
      </div>
    );
  }
}

export default FeedTemplateIX;
