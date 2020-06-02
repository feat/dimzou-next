import React from "react";

import Badge from "@feat/feat-ui/lib/badge";
import Avatar from "@feat/feat-ui/lib/avatar";

/** 简单的徽章展示，当 count 为 0 时，默认不显示，但是可以使用 showZero 修改为显示。 */
const Basic = (props) => (
  <div>
    <Badge count={5} className="margin_r_12">
      <Avatar />
    </Badge>
    <Badge count={5} className="margin_r_12" size="sm">
      <Avatar />
    </Badge>
    <Badge count={0} showZero>
      <Avatar />
    </Badge>
  </div>
);

export default Basic;
