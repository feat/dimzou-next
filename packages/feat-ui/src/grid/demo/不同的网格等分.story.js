import React from "react";
import { Row, Col } from "@feat/feat-ui/lib/grid";
import { boolean } from "@storybook/addon-knobs";


const style = {
  width: "100%",
  height: "50px",
  background: "lightblue",
  border: "1px solid",
  boxSizing: "border-box",
  textAlign: "center",
  lineHeight: "50px",
};

const DemoBlock = ({ text }) => (
  <div style={style} >{text}</div>
);

const Example = () => (
  <div>
    <h3>Row 拥有两种网格模型, 使用divisionBy设置</h3>
    <h4>默认为24等分</h4>
    <Row gutter={12}>
      <Col span={6} >
        <DemoBlock text="span-6" />
      </Col>
      <Col span={6}>
        <DemoBlock text="span-6" />
      </Col>
      <Col span={6}>
        <DemoBlock text="span-6" />
      </Col>
      <Col span={6}>
        <DemoBlock text="span-6" />
      </Col>
    </Row>
    <h4>设置为5等分</h4>
    <Row divisionBy={5} gutter={12}>
      <Col span={2}>
        <DemoBlock text="span-2" />
      </Col>
      <Col span={2}>
        <DemoBlock text="span-2" />
      </Col>
      <Col span={1}>
        <DemoBlock text="span-1" />
      </Col>
    </Row>
  </div>
);

export default Example;
