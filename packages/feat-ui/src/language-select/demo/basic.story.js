import React from "react";

import LanguageSelect from "@feat/feat-ui/lib/language-select";

/** LanguageSelect - Basic */
const Example = (props) => (
  <LanguageSelect
    onChange={(value) => { console.log(value); }}
  />
)

export default Example;
