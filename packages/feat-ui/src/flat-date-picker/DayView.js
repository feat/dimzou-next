import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";
import OptionButton from "./OptionButton";

export default function DayView(props) {
  const { onClick, isValid, label = 'Day' } = props;
  const year =
    props.compos.year === undefined ? props.viewDate.year() : props.compos.year;
  const month =
    props.compos.month === undefined
      ? props.viewDate.month()
      : props.compos.month;
  const selectedDay = props.compos.day;

  let defaultDay;
  if (selectedDay === undefined) {
    defaultDay = props.viewDate.date();
  }

  const daysCount = moment([year, month]).daysInMonth();
  const dayOptions = [...new Array(daysCount)].map((_, i) => {
    const val = i + 1;
    const valid = isValid({ year, month, date: val }, "day");

    return {
      type: "day",
      value: val,
      label: val,
      className: classNames({
        "is-selected": valid && val === selectedDay,
        "ft-FlatDatePicker__option_marked": valid && val === defaultDay,
        "is-disabled": !valid,
      }),
    };
  });

  return (
    <div className="ft-FlatDatePicker__dayCompo">
      <div className="ft-FlatDatePicker__compoTitle">{label}</div>
      <div className="ft-FlatDatePicker__compoContent">
        <div className="ft-FlatDatePicker__optionList">
          {dayOptions.map((option) => (
            <OptionButton key={option.value} {...option} onClick={onClick} />
          ))}
        </div>
      </div>
    </div>
  );
}

DayView.propTypes = {
  compos: PropTypes.shape({
    year: PropTypes.number,
    month: PropTypes.number,
    day: PropTypes.number,
  }),
  viewDate: PropTypes.instanceOf(moment),
  onClick: PropTypes.func,
  isValid: PropTypes.func,
  label: PropTypes.node,
};
