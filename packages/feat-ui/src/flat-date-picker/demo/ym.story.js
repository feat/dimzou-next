import React from 'react';
import moment from 'moment';
import FlatDatePicker from '@feat/feat-ui/lib/flat-date-picker';

/** FlatDatePicker 年月选择 */

const Example = () => (
  <div>
    <FlatDatePicker
      originYear={moment().year()}
      pickerMode="history"
      viewMode="YM"
      yearRange={72}
      onChange={(m, dateString) => {
        console.log(m, dateString);
      }}
    />
  </div>
);

export default Example;
