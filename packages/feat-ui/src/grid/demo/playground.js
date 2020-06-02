import React from "react";
import { Row, Col } from "@feat/feat-ui/lib/grid";
import { number } from "@storybook/addon-knobs";

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

const options = {
  range: true,
  min: 0,
  max: 100,
  step: 2,
};

const Example = () => (
  <div>
    <h3>Row的gutter属性 gutter: {`${number("gutter", 12, options)}px`}</h3>
    <Row flex gutter={number("gutter", 12, options)}>
      <Col span={6} auto>
        <DemoBlock text="span-6" />
      </Col>
      <Col span={6} auto>
        <DemoBlock text="span-6" />
      </Col>
      <Col span={6} auto>
        <DemoBlock text="span-6" />
      </Col>
      <Col span={6} auto>
        <DemoBlock text="span-6" />
      </Col>
    </Row>
  </div>
);

export default Example;
