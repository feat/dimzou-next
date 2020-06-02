import React from "react";

import TextInput from "@feat/feat-ui/lib/text-input";

/** TextInput - Size */
const Example = (props) => (
  <div>
    <h3>sm -- default</h3>
    <div>
      <TextInput size="sm" placeholder="placeholder" />
    </div>
    <h3>md</h3>
    <div>
      <TextInput size="md" placeholder="placeholder" />
    </div>
    <h3>lg</h3>
    <div>
      <TextInput size="lg" placeholder="placeholder" />
    </div>
  </div>
);

export default Example;
