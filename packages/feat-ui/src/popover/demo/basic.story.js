import React from "react";
import Button from "@feat/feat-ui/lib/button";
import Popover from "@feat/feat-ui/lib/popover";

const content = (
  <div style={{ width: 200, backgroundColor: "#fff" }}>
    <h3>title</h3>
    <p>content</p>
  </div>
);

/** 气泡卡片的用法。 */
const Example = () => (
  <div style={{ width: 400, margin: "0 auto" }}>
    <Popover content={content} closeOnOutsideClick>
      <Button>click me!</Button>
    </Popover>
  </div>
);

export default Example;
