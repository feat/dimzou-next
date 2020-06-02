import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { Row, Col, FlexCol } from "../grid";
import { namespace as defaultNamespace } from "../config";

class FeedTemplateXI extends PureComponent {
  static maxItemCount = 7;

  static propTypes = {
    namespace: PropTypes.string,
    className: PropTypes.string,
    items: PropTypes.array,
    itemProps: PropTypes.object,
  };

  static defaultProps = {
    namespace: defaultNamespace,
  };

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
        className={classNames(blockName, `${blockName}_XI`, className)}
      >
        {items[0] && this.renderI(items[0], undefined, itemProps)}
        <div className={`${blockName}__section`}>
          {items.slice(1, 7).map((item, i) => (
            <div className={`${blockName}__cell`} span={12} key={i}>
              <div className={`${blockName}__item`}>
                {this.renderII(item, i, itemProps)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default FeedTemplateXI;
