import React from 'react';
import Block from "@feat/feat-ui/lib/block";

/** block的基本使用 */
const Example =     () => (
  <Block
    title="Demo Block"
    subHeader={(
      <Block.Help className="t-right">
            　This block for display information
      </Block.Help>
    )}
    ref={(n) => {
      console.log(n);
    }}
  >
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  </Block>
)

export default Example;
