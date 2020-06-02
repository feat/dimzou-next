import React from "react";
import Badge from "@feat/feat-ui/lib/badge";

const style = {
  display: "inline-block",
  paddingLeft: "12px",
  paddingRight: "12px",
};

/** 超过 overflowCount 的会显示为 overflowCount，默认的 overflowCount 为 99。 */
const Example = () => (
  <div>
    <Badge className="margin_r_12" count={99}>
      <a href="#" style={style} >DemoText</a>
    </Badge>
    <Badge className="margin_r_12" count={100}>
      <a href="#" style={style} >DemoText</a>
    </Badge>
    <Badge className="margin_r_12" count={99} overflowCount={10}>
      <a href="#" style={style} >DemoText</a>
    </Badge>
    <Badge className="margin_r_12" count={1000} overflowCount={999}>
      <a href="#" style={style} >DemoText</a>
    </Badge>
  </div>
);

export default Example;
