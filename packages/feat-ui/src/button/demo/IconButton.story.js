import React from "react";
import IconButton from "@feat/feat-ui/lib/button/IconButton";
import SvgIcon from "@feat/feat-ui/lib/svg-icon";

/** 包裹一组按钮， 可以控制按钮是否为独占一行。 */
const Example = () => (
  <div>
    <h3>Nomral</h3>
    <IconButton svgIcon="logout" />
  </div>
);

export default Example;
