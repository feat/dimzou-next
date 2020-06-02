import React from "react";
import { number, select } from "@storybook/addon-knobs";
import SvgIcon from "@feat/feat-ui/lib/svg-icon";

const iconsList = require.context("!!raw-loader!../icons", false, /\.svg$/);

const parse = (str) => str.replace(/^\.\/(\S+)\.svg$/, "$1");

const options = {};

iconsList.keys().forEach((filename) => {
  const key = parse(filename);
  options[key] = key;
});

const Example = () => (
  <div style={{ marginLeft: 400, marginTop: 100 }}>
    <SvgIcon
      icon={select("Type", options, "weekday-0")}
      width={number("Width", 24)}
      height={number("Height", 24)}
    />
  </div>
);

export default Example;
