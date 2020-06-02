import React from 'react';

import FlatRangePicker from '@feat/feat-ui/lib/flat-date-picker/FlatRangePicker';

const Example = () => (
  <div>
    <FlatRangePicker
      pickerMode="history"
      viewMode="Hm"
      format="HH:mm"
      yearRange={72}
      onChange={(m, dateString) => {
        console.log(m, dateString);
        console.log(m[0].format('HH:mm'));
      }}
    />
  </div>
);

export default Example;
