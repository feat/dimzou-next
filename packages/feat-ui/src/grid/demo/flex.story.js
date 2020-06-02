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
const DemoBlock = ({ text }) => (
  <div style={style} >{text}</div>
);

/** flex布局 */
const Example = () => (
  <div>
    <h3>使用flex布局时，可获得更多特性</h3>
    <h4>Flex Row，不使用wrap属性时，多余栅格不会换行</h4>
    <Row flex gutter={12}>
      <Col span={8}>
        <DemoBlock text="span-8" />
      </Col>
      <Col span={8}>
        <DemoBlock text="span-8" />
      </Col>
      <Col span={8}>
        <DemoBlock text="span-8" />
      </Col>
      <Col span={8}>
        <DemoBlock text="span-8" />
      </Col>
    </Row>

    <h4>Row设置wrap属性，超出栅格会换行，对应flex-wrap属性</h4>
    <p>不支持gutter</p>
    <Row gutter={12} flex wrap>
      <Col span={8}>
        <DemoBlock text="span-8" />
      </Col>
      <Col span={8}>
        <DemoBlock text="span-8" />
      </Col>
      <Col span={8}>
        <DemoBlock text="span-8" />
      </Col>
      <Col span={8}>
        <DemoBlock text="span-8" />
      </Col>
    </Row>

    <h4>自动扩展, Col设置auto</h4>
    <Row gutter={12} flex>
      <Col span={8}>
        <DemoBlock text="span-8" />
      </Col>
      <Col auto>
        <DemoBlock text="Auto" />
      </Col>
    </Row>
  </div>
);

export default Example;
