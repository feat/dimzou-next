import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import OptionButton from './OptionButton';

export default function YearView(props) {
  const {
    pickerMode,
    format,
    viewDate,
    minDate,
    maxDate,
    onClick,
    isValid,
    yearRange,
    originYear,
    label = 'Year',
  } = props;
  let minYear;
  let maxYear;

  if (yearRange && pickerMode !== 'normal') {
    if (pickerMode === 'future') {
      minYear = moment().year();
      maxYear = minYear + yearRange;
    }
    if (pickerMode === 'history') {
      maxYear = originYear || moment().year();
      minYear = maxYear - yearRange + 1;
    }
  } else {
    if (maxDate && typeof maxDate === 'string') {
      maxYear = moment(maxDate, format).year();
    } else if (maxDate) {
      maxYear = maxDate.year();
    } else {
      maxYear = moment().year();
    }

    if (minDate && typeof minDate === 'string') {
      minYear = moment(minDate, format).year();
    } else if (minDate) {
      minYear = minDate.year();
    } else {
      minYear = moment().year();
    }
  }

  const selectedYear = props.compos.year;
  const defaultYear = viewDate.year();
  const yearOptions = [];

  for (let year = minYear; year <= maxYear; year += 1) {
    const valid = isValid({ year }, 'year');

    yearOptions.push({
      type: 'year',
      value: year,
      label: String(year).substr(2),
      className: classNames({
        'is-selected': valid && year === selectedYear,
        'ft-FlatDatePicker__option_marked': valid && year === defaultYear,
        'is-disabled': !valid,
      }),
    });
  }

  return (
    <div className="ft-FlatDatePicker__yearCompo">
      <div className="ft-FlatDatePicker__compoTitle">{label}</div>
      <div className="ft-FlatDatePicker__compoContent">
        <div className="ft-FlatDatePicker__optionList">
          {yearOptions.map((option) => (
            <OptionButton key={option.value} {...option} onClick={onClick} />
          ))}
        </div>
      </div>
    </div>
  );
}

YearView.propTypes = {
  compos: PropTypes.shape({
    year: PropTypes.number,
    month: PropTypes.number,
    day: PropTypes.number,
    hour: PropTypes.number,
    minute: PropTypes.number,
  }),
  pickerMode: PropTypes.string,
  isValid: PropTypes.func,
  yearRange: PropTypes.number,
  originYear: PropTypes.number,
  label: PropTypes.node,
  viewDate: PropTypes.object, // moment object
  minDate: PropTypes.object, // moment object
  maxDate: PropTypes.object, // moment object
  onClick: PropTypes.func,
  format: PropTypes.string,
};
