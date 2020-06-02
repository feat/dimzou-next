import React from 'react';

import LazyImage from '@feat/feat-ui/lib/lazy-image';

const demoImage = 'http://lorempixel.com/640/480/sports/';

/** LazyImage - Basic */
const Example = (props) => (
  <>
    <div style={{ height: 1000 }}></div>
    <LazyImage src={demoImage} />
  </>
);

export default Example;
