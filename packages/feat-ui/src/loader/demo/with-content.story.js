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
      <Loader size="xs">加载中</Loader>
    </div>
    <div style={style}>
      <Loader size="sm">加载中</Loader>
    </div>
    <div style={style}>
      <Loader size="md">加载中</Loader>
    </div>
    <div style={style}>
      <Loader size="lg">加载中</Loader>
    </div>
  </div>
);

export default Example;
