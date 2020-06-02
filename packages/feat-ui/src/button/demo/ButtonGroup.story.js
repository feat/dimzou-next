import React from "react";
import Button from "@feat/feat-ui/lib/button";

/** 包裹一组按钮， 可以控制按钮是否为独占一行。 */
const Example = () => (
  <div>
    <h3>nomral</h3>
    <Button.Group>
      <Button type="primary">primary</Button>
      <Button type="dashed">dashed</Button>
      <Button type="danger">danger</Button>
      <Button type="default">default</Button>
      <Button type="link">link</Button>
      <Button type="merge">merge</Button>
    </Button.Group>
    <h3>Button.Group 表现为block，并且按钮占满所有空间</h3>
    <Button.Group block>
      <Button type="primary">primary</Button>
      <Button type="dashed">dashed</Button>
      <Button type="danger">danger</Button>
      <Button type="default">default</Button>
      <Button type="link">link</Button>
      <Button type="merge">merge</Button>
    </Button.Group>
  </div>
);

export default Example;
