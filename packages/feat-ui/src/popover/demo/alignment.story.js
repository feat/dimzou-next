import React from "react";
import Button from "@feat/feat-ui/lib/button";
import Popover from "@feat/feat-ui/lib/popover";
import { RectShape } from "@feat/feat-ui/lib/placeholder";

/** 气泡卡片的用法。 */
const Example = () => (
  <div style={{ width: 400, margin: "0 auto" }}>
    <Popover
      placement="bottom"
      content={
        <div style={{ width: "200px" }}>
          <RectShape ratio={16 / 9} />
        </div>
      }
      trigger="click"
    >
      <Button block>Add Period</Button>
    </Popover>
  </div>
);

export default Example;
