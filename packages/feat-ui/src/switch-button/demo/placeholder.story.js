import React from "react";
import SwitchButton from "@feat/feat-ui/lib/switch-button";

/** 可切换按钮的基本使用。 */
const options = [
  { value: "1", label: "apple" },
  { value: "2", label: "banana" },
  { value: "3", label: "peach" },
];

const Example = () => (
  <SwitchButton
    onChange={(value, option) => { console.log(value, option); }}
    options={options}
    placeholder="Select fruit"
  />
);

export default Example;
