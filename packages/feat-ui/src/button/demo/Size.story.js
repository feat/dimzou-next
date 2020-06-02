import React from "react";
import Button from "@feat/feat-ui/lib/button";
import SquareButton from "@feat/feat-ui/lib/button/SquareButton";
import RoundButton from "@feat/feat-ui/lib/button/RoundButton";
import IconButton from "@feat/feat-ui/lib/button/IconButton";

import Wrapper from "./Wrapper";

/** 三种尺寸 */
const Example = () => (
  <div>
    <Wrapper>
      <Wrapper>
        <Button size="xs">xsmall</Button>
      </Wrapper>
      <Wrapper>
        <SquareButton size="xs">X</SquareButton>
      </Wrapper>
      <Wrapper>
        <RoundButton size="xs">X</RoundButton>
      </Wrapper>
      <Wrapper>
        <IconButton svgIcon="logout" size="xs" />
      </Wrapper>
    </Wrapper>
    <Wrapper>
      <Wrapper>
        <Button size="sm">small</Button>
      </Wrapper>
      <Wrapper>
        <SquareButton size="sm">S</SquareButton>
      </Wrapper>
      <Wrapper>
        <RoundButton size="sm">S</RoundButton>
      </Wrapper>
      <Wrapper>
        <IconButton svgIcon="logout" size="sm" />
      </Wrapper>
    </Wrapper>
    <Wrapper>
      <Wrapper>
        <Button size="md">middle</Button>
      </Wrapper>
      <Wrapper>
        <SquareButton size="md">M</SquareButton>
      </Wrapper>
      <Wrapper>
        <RoundButton size="md">M</RoundButton>
      </Wrapper>
      <Wrapper>
        <IconButton svgIcon="logout" size="md" />
      </Wrapper>
    </Wrapper>
    <Wrapper>
      <Wrapper>
        <Button size="lg">large</Button>
      </Wrapper>
      <Wrapper>
        <SquareButton size="lg">L</SquareButton>
      </Wrapper>
      <Wrapper>
        <RoundButton size="lg">L</RoundButton>
      </Wrapper>
      <Wrapper>
        <IconButton svgIcon="logout" size="lg" />
      </Wrapper>
    </Wrapper>
  </div>
);
export default Example;
