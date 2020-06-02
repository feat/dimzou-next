import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { Row, Col, FlexCol } from "../grid";

import { namespace as defaultNamespace } from "../config";

class FeedTemplateVII extends PureComponent {
  static maxItemCount = 5;

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
        className={classNames(blockName, `${blockName}_VII`, className)}
      >
        <div className={`${blockName}__Col1`}>
          {items[0] && this.renderI(items[0], undefined, itemProps)}
        </div>
        <div className={`${blockName}__Col2`}>
          <Row flex wrap>
            {
              items.slice(1).map((item, index) => (
                <Col span={12} key={index}>
                  <FlexCol>
                    {this.renderII(item, index, itemProps)}
                  </FlexCol>
                </Col>
              ))
            }
          </Row>
        </div>
      </div>
    );
  }
}

export default FeedTemplateVII;
