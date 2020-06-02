import React from "react";
import Badge from "@feat/feat-ui/lib/badge";

/** 不包裹任何元素即是独立使用，可自定样式展现。 */
const Example = () => (
  <div className="padding_l_24">
    <div>
      <Badge count={25} />
    </div>
    <div>
      <Badge
        count={4}
        style={{ backgroundColor: "#fff", color: "#999", boxShadow: "0 0 0 1px #d9d9d9 inset" }}
      />
    </div>
    <Badge count={109} style={{ backgroundColor: "#87d068" }} />
  </div>
);
export default Example;
