import React from "react";
import Flag from "@feat/feat-ui/lib/flag";

/** digitInput 的基本使用, 使用国家名以及代号均可。具体代号参考semantic flag组件。 */
const Example = () => (
  <div>
    <h3>国家名称</h3>
    <Flag country="china" />
    <Flag country="united states" />
    <Flag country="japan" />
    <h3>国家代号</h3>
    <Flag country="cn" />
    <Flag country="us" />
    <Flag country="jp" />
  </div>
);

export default Example;
