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
    <h3>设置Row的gutter属性 gutter: 12px </h3>
    <Row gutter={12}>
      <Col span={6}>
        <DemoBlock text="span-6" />
      </Col>
      <Col span={6}>
        <DemoBlock text="span-6" />
      </Col>
      <Col span={9}>
        <DemoBlock text="span-9" />
      </Col>
      <Col span={3}>
        <DemoBlock text="span-3" />
      </Col>
    </Row>
    <h3>默认布局为float，可设置Row的flex属性，更多特性请看flex例子</h3>
    <Row gutter={12} flex>
      <Col span={6}>
        <DemoBlock text="span-6" />
      </Col>
      <Col span={6}>
        <DemoBlock text="span-6" />
      </Col>
      <Col span={9}>
        <DemoBlock text="span-9" />
      </Col>
      <Col span={3}>
        <DemoBlock text="span-3" />
      </Col>
    </Row>
    <h3>设置Col的offset属性</h3>
    <Row gutter={12}>
      <Col span={6} offset={6}>
        <DemoBlock text="span-6 offset-6" />
      </Col>
      <Col span={9}>
        <DemoBlock text="span-9" />
      </Col>
      <Col span={3}>
        <DemoBlock text="span-3" />
      </Col>
    </Row>
    <h3>设置Row的gutter属性</h3>
    <Row gutter={12}>
      <Col span={6} offset={6}>
        <DemoBlock text="span-6 offset-6" />
      </Col>
      <Col span={9}>
        <DemoBlock text="span-9" />
      </Col>
      <Col span={3}>
        <DemoBlock text="span-3" />
      </Col>
    </Row>
  </div>
);

export default Example;
