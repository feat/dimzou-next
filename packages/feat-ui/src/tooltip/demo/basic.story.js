import React from "react";
import PropTypes from "prop-types";
import Tooltip from "@feat/feat-ui/lib/tooltip";

/** 最简单的用法。 */
const Example = () => (
  <div>
    <Tooltip title={<div>my title is really cool!</div>}>
      <span>hover on me!</span>
    </Tooltip>
  </div>
)

export default Example;
