import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { namespace as defaultNamespace } from "../config";

import { Row, Col, FlexCol } from "../grid";

class FeedTemplateV extends PureComponent {
  static maxItemCount = 6;

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
      <Row
        flex
        wrap
        className={classNames(blockName, `${blockName}_V`, className)}
        {...restProps}
      >
        {items.map((item, index) => (
          <Col span={8} key={index}>
            <FlexCol>
              {this.renderI(item, index, itemProps)}
            </FlexCol>
          </Col>
        ))}
      </Row>
    );
  }
}

export default FeedTemplateV;
