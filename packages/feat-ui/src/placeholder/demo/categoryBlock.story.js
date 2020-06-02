import React from "react";
import { TextBlock, TextRow } from "@feat/feat-ui/lib/placeholder";
import Block from "@feat/feat-ui/lib/block";

import "./categoryBlock.style.scss";

export default function Example() {
  return (
    <Block title={<TextRow className="ft-Block__titlePlaceholder" />}>
      <TextBlock row={10} />
    </Block>
  );
}
