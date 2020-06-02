import React from "react";
import IconButton from "@feat/feat-ui/lib/button/IconButton";
import { text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";

const Example = () => (
  <div style={{ margin: "20px auto" }}>
    <IconButton
      size="md"
      svgIcon={text("svgIcon", "logout")}
      onClick={action("button-click")}
    />
  </div>
);

export default Example;
