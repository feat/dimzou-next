import React from "react";
import {
  RectShape,
  RoundShape,
  TextRow,
  TextBlock,
} from "@feat/feat-ui/lib/placeholder";

/** 占位符， 开发用 */
const Example = () => (
  <div>
    <RectShape label="轮播图(500 X 400)" width={500} height={400} />
    <br />
    <RectShape
      label="文章(width: 400, ratio: 16/9)"
      width={400}
      ratio={16 / 9}
    />
    <br />
    <RoundShape size={56} />
    <TextRow />
    <TextRow />
    <TextRow />
    <TextRow modifier="half" />
    <RoundShape size={56} />
    <TextBlock row={3} />
  </div>
);

export default Example;
