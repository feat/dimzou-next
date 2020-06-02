import React from "react";
import Popover from "@feat/feat-ui/lib/popover";
import Button from "@feat/feat-ui/lib/button";
import _ from "lodash";
import { select, boolean } from "@storybook/addon-knobs";
import SETTING from "../../align/placements";

const options = {};

Object.keys(SETTING).forEach((key) => {
  options[_.upperFirst(key)] = key;
});

const Example = () => (
  <div style={{ width: 200, margin: "200px auto" }}>
    <Popover
      content={
        <div style={{ width: 200, backgroundColor: "#fff" }}>
          <h4>placement</h4>
          <div>you can change the position of me</div>
        </div>
      }
      placement={select("placement", options, "left")}
      isMobile={boolean("isMobile")}
    >
      <Button>click me!</Button>
    </Popover>
  </div>
);

export default Example;
