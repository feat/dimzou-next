import React from "react";
import Icon from "@feat/feat-ui/lib/icon";

/** icon */
const Example = () => (
  <div>
    <h3>种类</h3>
    <div>
      <Icon name="success" />
      <Icon name="warning" />
      <Icon name="info" />
      <Icon name="error" />
      <Icon name="close" />
    </div>
    <h3>样式</h3>
    <div>
      <Icon name="success" style={{ color: "green" }} />
      <Icon name="warning" style={{ color: "red" }} />
    </div>
  </div>
);

export default Example;
