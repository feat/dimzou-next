import React from "react";

import { Row, Col } from "@feat/feat-ui/lib/grid";
import SvgIcon from "@feat/feat-ui/lib/svg-icon";
import icons from './preview';

const IconDisplay = ({ icon }) => (
  <div className="t-center padding_12">
    <SvgIcon icon={icon} />
    <div>{icon}</div>
  </div>
)

const Example = () => (
  <Row>
    {icons.map((icon) => (
      <Col span={3} key={icon}>
        <IconDisplay icon={icon} />
      </Col>
    ))}
  </Row>
);

export default Example;
