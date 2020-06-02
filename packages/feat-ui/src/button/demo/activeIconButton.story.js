import React from "react";
import IconButton from "@feat/feat-ui/lib/button/IconButton";
import SvgIcon from "@feat/feat-ui/lib/svg-icon";

/** 包裹一组按钮， 可以控制按钮是否为独占一行。 */
const Example = () => (
  <div>
    <h3>Active Icon Button</h3>
    <div>
      <IconButton isActive svgIcon="heart" />
    </div>
    <div>
      <IconButton isActive svgIcon="setting" />
    </div>
    <div>
      <IconButton isActive svgIcon="translate-v2" />
    </div>
    <div>
      <IconButton isActive svgIcon="im" />
    </div>
  </div>
);

export default Example;
