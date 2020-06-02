import React from "react";
import MaskLoader from "@feat/feat-ui/lib/loader/MaskLoader";

/** 异步加载时使用 */
const style = {
  width: 200,
  height: 100,
  position: "relative",
  backgroundColor: "#333",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Example = () => (
  <div>
    <div style={style}>
      <h3>Some Content</h3>
      <MaskLoader loaderSize="xs" />
    </div>
  </div>
);

export default Example;
