import React from "react";
import { Row, Col } from "@feat/feat-ui/lib/grid";
import Avatar from "@feat/feat-ui/lib/avatar";
import demoAvatar from './avatar.png';

const Shape = () => (
  <Row>
    <Col span={6}>
      <Avatar avatar={demoAvatar} />
    </Col>
    <Col span={6}>
      <Avatar avatar={demoAvatar} round />
    </Col>
  </Row>
);

export default Shape;
