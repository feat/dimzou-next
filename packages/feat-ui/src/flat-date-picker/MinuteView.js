import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import OptionButton from './OptionButton';

export default function MinuteView(props) {
  const {
    viewDate,
    // minDate,
    // maxDate,
    onClick,
    isValid,
    minuteStep,
    label = 'Minute',
  } = props;
  const selectedMinute = props.compos.minute;
  const year =
    props.compos.year === undefined ? viewDate.year() : props.compos.year;
  const month =
    props.compos.month === undefined ? viewDate.month() : props.compos.month;
  const day =
    props.compos.day === undefined ? viewDate.date() : props.compos.day;
  const hour =
    props.compos.hour === undefined ? viewDate.hour() : props.compos.hour;
  let defaultMinute;
  if (selectedMinute === undefined) {
    defaultMinute = viewDate.minute();
  }
  const minuteOptions = [];
  for (let i = 0; i < 60; i += minuteStep) {
    const valid = isValid({ year, month, day, hour, minute: i }, 'minute');

    minuteOptions.push({
      type: 'minute',
      value: i,
      label: i,
      className: classNames({
        'is-selected': valid && i === selectedMinute,
        'ft-FlatDatePicker__option_marked': valid && i === defaultMinute,
        'is-disabled': !valid,
      }),
    });
  }
  return (
    <div className="ft-FlatDatePicker__minuteCompo">
      <div className="ft-FlatDatePicker__compoTitle">{label}</div>
      <div className="ft-FlatDatePicker__compoContent">
        <div className="ft-FlatDatePicker__optionList">
          {minuteOptions.map((option) => (
            <OptionButton key={option.value} {...option} onClick={onClick} />
          ))}
        </div>
      </div>
    </div>
  );
}

MinuteView.propTypes = {
  compos: PropTypes.shape({
    year: PropTypes.number,
    month: PropTypes.number,
    day: PropTypes.number,
    hour: PropTypes.number,
    minute: PropTypes.number,
  }),
  label: PropTypes.node,
  isValid: PropTypes.func,
  viewDate: PropTypes.instanceOf(moment),
  onClick: PropTypes.func,
  minuteStep: PropTypes.number,
};
