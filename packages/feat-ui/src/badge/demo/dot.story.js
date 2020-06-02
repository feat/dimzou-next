import React from "react";

import Badge from "@feat/feat-ui/lib/badge";
import Avatar from "@feat/feat-ui/lib/avatar";

/** 讨厌的小红点 */
const Dot = () => (
  <div>
    <Badge dot>
      <Avatar />
    </Badge>
    <Badge dot>
      <a href="#">Link something</a>
    </Badge>
  </div>
);

export default Dot;
