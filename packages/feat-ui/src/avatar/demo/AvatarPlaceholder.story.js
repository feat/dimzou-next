import React from "react";
import { Row, Col } from "@feat/feat-ui/lib/grid";
import AvatarPlacholder from "@feat/feat-ui/lib/avatar/AvatarPlaceholder";

const Shape = () => (
  <Row>
    <Col span={6}>
      <AvatarPlacholder round />
    </Col>
    <Col span={6}>
      <AvatarPlacholder />
    </Col>
  </Row>
);

export default Shape;
