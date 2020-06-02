import React from "react";
import PropTypes from "prop-types";
import Tooltip from "@feat/feat-ui/lib/tooltip";
import { RectShape } from "@feat/feat-ui/lib/placeholder";

import { text, select, array, number } from "@storybook/addon-knobs";

const options = {
  top: "top",
  left: "left",
  right: "right",
  bottom: "bottom",
  topLeft: "topLeft",
  topRight: "topRight",
  bottomLeft: "bottomLeft",
  bottomRight: "bottomRight",
  leftTop: "leftTop",
  leftBottom: "leftBottom",
  rightTop: "rightTop",
  rightBottom: "rightBottom",
};

const numOp = {
  range: true,
  min: 0.1,
  max: 10,
  step: 0.1,
};

const Example = () => (
  <div>
    <Tooltip
      title={text("title", "some tips for you!")}
      placement={select("placement", options, "top")}
      trigger={array("trigger", ["hover"], " ")}
      mouseEnterDelay={number("enterDelay", 0.1, numOp)}
      mouseLeaveDelay={number("leaveDelay", 0.1, numOp)}
    >
      <RectShape
        style={{ margin: "100px auto" }}
        height={200}
        width={200}
        label="I am a tooltip!!!"
      />
    </Tooltip>
  </div>
);

export default Example;
