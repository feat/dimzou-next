import React from 'react';

import BaseCounter from '@feat/feat-ui/lib/flip-counter/Base';
import '@feat/feat-ui/lib/flip-counter/style/index.scss';

/** Flip Counter - Basic */
const Example = (props) => (
  <BaseCounter
    stop={new Date(Date.now() + 1000 * 10)}
    onStart={() => {
      console.log(Date.now());
    }}
    onStop={() => {
      console.log(Date.now());
    }}
  />
);

export default Example;
