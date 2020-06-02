import React from 'react';
import moment from 'moment';
import FlatDatePicker from '@feat/feat-ui/lib/flat-date-picker';

/** FlatDatePicker 生日选择 */
const minAge = 16;

const Example = () => (
  <div>
    <FlatDatePicker
      originYear={moment().year() - minAge}
      pickerMode="history"
      modifier="ymd"
      viewMode="YMD"
      yearRange={72}
      onChange={(m, dateString) => {
        console.log(m, dateString);
      }}
      labels={{
        year: '年',
        month: '月',
        day: '日',
      }}
    />
  </div>
);

export default Example;
