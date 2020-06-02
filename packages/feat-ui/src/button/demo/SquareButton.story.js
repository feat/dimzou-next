import React from "react";
import SquareButton from "@feat/feat-ui/lib/button/SquareButton";

const Wrapper = (props) => (
  <span className="padding_12" {...props} />
);
  /** 通常用于展示icon */
const Example = () => (
  <div>
    <h3>Square Button</h3>
    <div>
      <Wrapper>
        <SquareButton size="sm">S</SquareButton>
      </Wrapper>
      <Wrapper>
        <SquareButton size="md">M</SquareButton>
      </Wrapper>
      <Wrapper>
        <SquareButton size="lg">L</SquareButton>
      </Wrapper>
    </div>
    <h3>Square Button type</h3>
    <div>
      <Wrapper>
        <SquareButton type="primary">B</SquareButton>
      </Wrapper>
      <Wrapper>
        <SquareButton type="dashed">B</SquareButton>
      </Wrapper>
      <Wrapper>
        <SquareButton type="danger">B</SquareButton>
      </Wrapper>
      <Wrapper>
        <SquareButton type="default">B</SquareButton>
      </Wrapper>
      <Wrapper>
        <SquareButton type="link">B</SquareButton>
      </Wrapper>
      <Wrapper>
        <SquareButton type="merge">B</SquareButton>
      </Wrapper>
    </div>
  </div>
);
export default Example;
