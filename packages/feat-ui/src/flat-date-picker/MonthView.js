import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import OptionButton from './OptionButton';

export default function MonthView(props) {
  const {
    viewDate,
    onClick,
    isValid,
    label = 'Month',
  } = props;
  const year =
    props.compos.year === undefined ? viewDate.year() : props.compos.year;
  const selectedMonth = props.compos.month;
  let defaultMonth;
  if (!selectedMonth) {
    defaultMonth = viewDate.month();
  }

  const monthsShort = props.viewDate.localeData()._monthsShort;
  const monthOptions = [...new Array(12)].map((_, i) => {
    const valid = isValid({ year, month: i }, 'month');
    return {
      type: 'month',
      value: i,
      label: monthsShort[i],
      className: classNames({
        'is-selected': valid && i === selectedMonth,
        'ft-FlatDatePicker__option_marked': valid && i === defaultMonth,
        'is-disabled': !valid,
      }),
    };
  });

  return (
    <div className="ft-FlatDatePicker__monthCompo">
      <div className="ft-FlatDatePicker__compoTitle">{label}</div>
      <div className="ft-FlatDatePicker__compoContent">
        <div className="ft-FlatDatePicker__optionList">
          {monthOptions.map((option) => (
            <OptionButton key={option.value} {...option} onClick={onClick} />
          ))}
        </div>
      </div>
    </div>
  );
}

MonthView.propTypes = {
  compos: PropTypes.shape({
    year: PropTypes.number,
    month: PropTypes.number,
  }),
  viewDate: PropTypes.instanceOf(moment),
  onClick: PropTypes.func,
  isValid: PropTypes.func,
  label: PropTypes.node,
};
