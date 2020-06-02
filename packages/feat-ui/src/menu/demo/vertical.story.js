import React from "react";

import Menu from "@feat/feat-ui/lib/menu";

/** __Menu__ - Veritcal Style */
const Example = () => (
  <div style={{ width: 300 }}>
    <Menu direction="vertical">
      <Menu.Item active>Home</Menu.Item>
      <Menu.Item>Content</Menu.Item>
      <Menu.Item>Next</Menu.Item>
    </Menu>
  </div>
);

export default Example;
