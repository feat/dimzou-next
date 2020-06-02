import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { Row, Col, FlexCol } from "../grid";

import { namespace as defaultNamespace } from "../config";
class FeedTemplateVIII extends PureComponent {
  static maxItemCount = 8;

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
        className={classNames(blockName, `${blockName}_VIII`, className)}
      >
        <Row flex wrap>
          {
            items.map((item, i) => (
              <Col span={6} key={i}>
                <FlexCol>
                  {this.renderI(item, i, itemProps)}
                </FlexCol>
              </Col>
            ))
          }
        </Row>
      </div>
    );
  }
}

export default FeedTemplateVIII;
