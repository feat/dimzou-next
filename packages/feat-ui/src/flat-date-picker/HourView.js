import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import OptionButton from './OptionButton';

export default function HourView(props) {
  const { viewDate, onClick, isValid, label = 'Hour' } = props;
  const year =
    props.compos.year === undefined ? viewDate.year() : props.compos.year;
  const month =
    props.compos.month === undefined ? viewDate.month() : props.compos.month;
  const day =
    props.compos.day === undefined ? viewDate.date() : props.compos.day;

  const selectedHour = props.compos.hour;
  let defaultHour;
  if (selectedHour === undefined) {
    defaultHour = viewDate.hour();
  }

  const hourOptions = [...new Array(24)].map((_, i) => {
    const valid = isValid({ year, month, day, hour: i, minute: 0 }, 'hour');

    return {
      type: 'hour',
      value: i,
      label: i,
      className: classNames({
        'is-selected': valid && i === selectedHour,
        'ft-FlatDatePicker__option_marked': valid && i === defaultHour,
        'is-disabled': !valid,
      }),
    };
  });

  return (
    <div className="ft-FlatDatePicker__hourCompo">
      <div className="ft-FlatDatePicker__compoTitle">{label}</div>
      <div className="ft-FlatDatePicker__compoContent">
        <div className="ft-FlatDatePicker__optionList">
          {hourOptions.map((option) => (
            <OptionButton key={option.value} {...option} onClick={onClick} />
          ))}
        </div>
      </div>
    </div>
  );
}

HourView.propTypes = {
  compos: PropTypes.shape({
    year: PropTypes.number,
    month: PropTypes.number,
    day: PropTypes.number,
    hour: PropTypes.number,
    minute: PropTypes.number,
  }),
  viewDate: PropTypes.instanceOf(moment),
  label: PropTypes.node,
  isValid: PropTypes.func,
  onClick: PropTypes.func,
};
