import React from 'react';

import FlatRangePicker from '@feat/feat-ui/lib/flat-date-picker/FlatRangePicker';

const Example = () => (
  <div>
    <FlatRangePicker
      viewMode="Hm"
      format="HH:mm"
      onChange={(m, dateString) => {
        console.log(m, dateString);
        console.log(m[0].format('HH:mm'));
      }}
      labels={{
        hour: '时',
        minute: '分',
      }}
    />
  </div>
);

export default Example;
