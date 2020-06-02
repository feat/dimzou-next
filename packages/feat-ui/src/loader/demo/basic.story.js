import React from "react";
import Loader from "@feat/feat-ui/lib/loader";

/** 异步加载时使用 */
const style = {
  width: 200,
  height: 100,
  position: "relative",
  // backgroundColor: "#333",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Example = () => (
  <div>
    <div style={style}>
      <Loader size="xs" />
    </div>
    <div style={style}>
      <Loader />
    </div>
    <div style={style}>
      <Loader size="md" />
    </div>
    <div style={style}>
      <Loader size="lg" />
    </div>
  </div>
);

export default Example;
