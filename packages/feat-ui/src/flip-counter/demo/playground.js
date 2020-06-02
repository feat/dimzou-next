import React from 'react';
import FlipCounter from '@feat/feat-ui/lib/flip-counter';
import { boolean, select, array } from '@storybook/addon-knobs';

const options = {
  sm: 'Small(sm)',
  md: 'Default(md)',
  lg: 'Large(lg)',
  xl: 'Extreme Large(xl)',
};

const Example = () => (
  <div style={{ margin: '20px auto' }}>
    <FlipCounter
      size={select('Size', options, 'md')}
      slotTitle={boolean('slotTitle', false)}
      show={array('Show', ['days', 'hours', 'minutes', 'seconds'], ',')}
      stop={new Date('2019-12-20')}
    />
  </div>
);

export default Example;
