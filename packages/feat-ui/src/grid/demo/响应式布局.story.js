import React from "react";
import { Row, Col } from "@feat/feat-ui/lib/grid";

const style = {
  width: "100%",
  height: "50px",
  background: "lightblue",
  border: "1px solid",
  boxSizing: "border-box",
  textAlign: "center",
  lineHeight: "50px",
};

const DemoBlock = ({ text }) => <div style={style}>{text}</div>;

/** 栅格系统为24等分 */
const Example = () => (
  <div>
    <h3>响应式布局:设置Col的xs sm md lg属性</h3>
    <Row>
      <Col xs={2} sm={8} md={10} lg={11}>
        <DemoBlock text="col" />
      </Col>
      <Col xs={20} sm={8} md={4} lg={2}>
        <DemoBlock text="col" />
      </Col>
      <Col xs={2} sm={8} md={10} lg={11}>
        <DemoBlock text="col" />
      </Col>
    </Row>
    <h3>等分</h3>
    <Row divisionBy={5} gutter={12}>
      <Col md={6} lg={6}>
        <DemoBlock text="col" />
      </Col>
      <Col md={6} lg={6}>
        <DemoBlock text="col" />
      </Col>
      <Col md={6} lg={6}>
        <DemoBlock text="col" />
      </Col>
      <Col md={6} lg={6}>
        <DemoBlock text="col" />
      </Col>
    </Row>
  </div>
);

export default Example;
