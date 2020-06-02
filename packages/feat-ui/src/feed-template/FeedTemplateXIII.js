import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { namespace as defaultNamespace } from "../config";

class FeedTemplateXIII extends PureComponent {
  static maxItemCount = 1;

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

  render() {
    const { namespace, className, items, itemProps, ...restProps } = this.props;
    const blockName = `${namespace}-FeedTemplate`;
    return (
      <div
        {...restProps}
        className={classNames(blockName, `${blockName}_XIII`, className)}
      >
        {items[0] && this.renderI(items[0], undefined, itemProps)}
      </div>
    );
  }
}

export default FeedTemplateXIII;
