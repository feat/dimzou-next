import React from 'react';
import moment from 'moment';
import FlatDatePicker from '@feat/feat-ui/lib/flat-date-picker';

/** FlatDatePicker 信用卡有效期 视图 */
const Example = () => (
  <div>
    <FlatDatePicker
      viewMode="YM"
      format="YYYY-MM"
      yearRange={5}
      pickerMode="future"
      minDate={moment()
        .startOf('month')
        .toISOString()}
      maxDate={moment()
        .add(5, 'year')
        .toISOString()}
      onChange={(m, dateString) => {
        console.log(m, dateString);
        console.log(m.toISOString());
      }}
    />
  </div>
);

export default Example;
