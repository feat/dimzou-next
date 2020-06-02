import React from "react";

import TextInput from "@feat/feat-ui/lib/text-input";

/** TextInput - Basic */
const Example = (props) => (
  <div>
    <h3>Inline </h3>
    <div>
      <TextInput placeholder="placeholder" />
    </div>
    <h3>Block</h3>
    <div>
      <TextInput block placeholder="placeholder" />
    </div>
    <h3>Merge</h3>
    <div style={{ backgroundColor: "#ccc", padding: 4 }}>
      <TextInput block modifier="merge" placeholder="placeholder" />
    </div>
  </div>
);

export default Example;
