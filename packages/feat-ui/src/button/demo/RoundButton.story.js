import React from "react";
import RoundButton from "@feat/feat-ui/lib/button/RoundButton";
import WithSource from "StoryUtil/_withSource";

const Wrapper = (props) => (
  <span className="padding_12" {...props} />
)

/** 提供圆形，主要用于Icon 按钮。 */
const Example = () => (
  <div>
    <h3>Round Button</h3>
    <div className="">
      <Wrapper>
        <RoundButton size="sm">S</RoundButton>
      </Wrapper>
      <Wrapper>
        <RoundButton size="md">M</RoundButton>
      </Wrapper>
      <Wrapper>
        <RoundButton size="lg">L</RoundButton>
      </Wrapper>
    </div>
    <h3>Round Button type</h3>
    <div>
      <Wrapper>
        <RoundButton type="primary">B</RoundButton>
      </Wrapper>
      <Wrapper>
        <RoundButton type="dashed">B</RoundButton>
      </Wrapper>
      <Wrapper>
        <RoundButton type="danger">B</RoundButton>
      </Wrapper>
      <Wrapper>
        <RoundButton type="default">B</RoundButton>
      </Wrapper>
      <Wrapper>
        <RoundButton type="link">B</RoundButton>
      </Wrapper>
      <Wrapper>
        <RoundButton type="merge">B</RoundButton>
      </Wrapper>
      <Wrapper>
        <RoundButton type="ok">OK</RoundButton>
      </Wrapper>
      <Wrapper>
        <RoundButton type="no">NO</RoundButton>
      </Wrapper>
    </div>
  </div>
);
export default Example;
