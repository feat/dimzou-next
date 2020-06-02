import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { namespace as defaultNamespace } from "../config";

class FeedTemplateX extends PureComponent {
  static maxItemCount = 4;

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

  render() {
    const { namespace, className, items, itemProps, ...restProps } = this.props;
    const blockName = `${namespace}-FeedTemplate`;
    return (
      <div
        {...restProps}
        className={classNames(blockName, `${blockName}_X`, className)}
      >
        <div className={`${blockName}__Col1`}>
          {items[0] && this.renderI(items[0], undefined, itemProps)}
        </div>
        <div className={`${blockName}__Col2`}>
          {items[1] && this.renderI(items[1], undefined, itemProps)}
        </div>
        <div className={`${blockName}__Col3`}>
          {items.slice(2, 4).map((item, index) => (
            this.renderII(item, index, itemProps)
          ))}
        </div>
      </div>
    );
  }
}

export default FeedTemplateX;
