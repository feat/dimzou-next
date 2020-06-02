import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import YearView from './YearView';
import MonthView from './MonthView';
import DayView from './DayView';
import HourView from './HourView';
import MinuteView from './MinuteView';

const getCompos = (viewMode) => {
  switch (viewMode) {
    case 'YMD':
      return { year: undefined, month: undefined, day: undefined };
    case 'YM':
      return { year: undefined, month: undefined };
    case 'Y':
      return { year: undefined };
    case 'MD':
      return { month: undefined, day: undefined };
    case 'YMDHm':
      return {
        year: undefined,
        month: undefined,
        day: undefined,
        hour: undefined,
        minute: undefined,
      };
    case 'Hm':
      return { hour: undefined, minute: undefined };
    default:
      return { year: undefined, month: undefined, day: undefined };
  }
};

const getMoment = (value, format) => {
  if (value && typeof value === 'string') {
    return moment(value, format);
  }
  if (value) {
    return moment(value);
  }
};

const isReady = (compos) =>
  Object.values(compos).every((val) => val !== undefined);

class FlatDatePicker extends Component {
  constructor(props) {
    super(props);
    this.map = {
      // key   regexp    moment.method
      day: ['D', 'date'],
      month: ['M', 'month'],
      year: ['Y', 'year'],
      hour: ['[Hh]', 'hours'],
      minute: ['m', 'minutes'],
      second: ['s', 'seconds'],
      ampm: ['[Aa]', ''],
    };
    this.parser = {
      minDate: (value) => getMoment(value, this.props.format),
      maxDate: (value) => getMoment(value, this.props.format),
    };
    this.componentProps = {
      fromProps: [
        'format',
        'renderDay',
        'renderMonth',
        'renderYear',
        'originYear',
        'yearRange',
        'pickerMode',
        'minDate',
        'maxDate',
        'minuteStep',
      ],
      fromState: ['viewDate', 'selectedDate', 'compos', 'minView'],
      fromThis: ['handleClick', 'localMoment', 'isValid'],
    };
    const state = this.getStateFromProps(props);
    this.state = state;
  }

  getStateFromProps(props) {
    const { format, viewMode } = props;
    const date = props.value || props.defaultValue;
    let selectedDate;
    let viewDate;

    const compos = getCompos(viewMode);
    const minView = ['minute', 'hour', 'day', 'month', 'year'].find((key) =>
      Object.prototype.hasOwnProperty.call(compos, key),
    );

    if (date && typeof date === 'string') {
      selectedDate = this.localMoment(date, format);
    } else if (date) {
      selectedDate = this.localMoment(date);
    }

    if (selectedDate && !selectedDate.isValid()) {
      selectedDate = null;
    }

    if (props.viewDate && typeof props.viewDate === 'string') {
      viewDate = this.localMoment(props.viewDate, props.viewDateFormat);
    } else if (props.viewDate) {
      viewDate = this.localMoment(props.viewDate);
    } else if (props.pickerMode === 'normal') {
      viewDate = selectedDate
        ? selectedDate.clone().startOf(minView)
        : this.localMoment().startOf(minView);
    } else {
      viewDate = selectedDate
        ? selectedDate.clone()
        : this.localMoment().startOf(minView);
    }

    return {
      viewDate,
      selectedDate,
      compos,
      minView,
    };
  }

  reset = () => {
    this.setState(this.getStateFromProps(this.props));
  };

  isValid = (compos, view) => {
    const m = moment(compos);
    const { minDate, maxDate, format, pickerMode } = this.props;
    const { minView } = this.state;
    let mmin;
    let mmax;
    let isValid = true;
    const validateView = view || minView;
    const isMinView = validateView === minView;
    if (this.props.isValid) {
      isValid = this.props.isValid(m, view, isMinView);
    }
    if (minDate && typeof minDate === 'string') {
      mmin = moment(minDate, format);
    } else if (minDate) {
      mmin = moment(minDate);
    } else if (pickerMode === 'future') {
      mmin = moment();
    }
    if (maxDate && typeof maxDate === 'string') {
      mmax = moment(maxDate, format);
    } else if (maxDate) {
      mmax = moment(maxDate);
    } else if (pickerMode === 'history') {
      mmax = moment();
    }

    if (isMinView) {
      // TODO inclusivity option
      isValid = isValid && (!mmin || m.isSameOrAfter(mmin.startOf(view)));
      isValid = isValid && (!mmax || m.isSameOrBefore(mmax.startOf(view)));
    } else {
      isValid = isValid && (!mmin || m.isSameOrAfter(mmin.startOf(view)));
      isValid = isValid && (!mmax || m.isSameOrBefore(mmax.endOf(view)));
    }

    return isValid;
  };

  localMoment(date, format) {
    const m = moment(date, format, this.props.strictParsing);
    if (this.props.locale) {
      m.locale(this.props.locale);
    } // TODO move locale setup to project moment setup ;
    return m;
  }

  handleClick = (e) => {
    e.preventDefault();
    const btn = e.target.closest('.ft-FlatDatePicker__option');
    if (!btn) {
      return;
    }
    if (btn.classList.contains('is-disabled')) {
      return;
    }

    const key = btn.dataset.type;
    const value = parseInt(btn.dataset.value, 10);
    const originDate = this.state.selectedDate
      ? this.state.selectedDate
      : this.state.viewDate;
    const newDate = originDate.clone()[this.map[key][1]](value);
    // newDate = this.filterDate(newDate);
    // validate newdate
    if (this.props.feedBack) {
      this.props.feedBack(newDate, key);
    }
    if (this.isValid(newDate, key)) {
      const newCompos = Object.assign({}, this.state.compos, { [key]: value });
      this.setState({
        selectedDate: newDate,
        viewDate: newDate.clone(),
        compos: newCompos,
      });
      if (isReady(newCompos)) {
        this.props.onChange(newDate, newDate.format(this.props.format));
      }
    }
  };

  componentWillReceiveProps(nextProps) {
    const { isValid, viewDate } = nextProps;
    let update = {};
    if (isValid !== this.props.isValid || viewDate !== this.props.viewDate) {
      update = this.getStateFromProps(nextProps);
      this.setState(update);
    }
  }

  getComponentProps = () => {
    const self = this;
    const props = {};
    this.componentProps.fromProps.forEach((name) => {
      props[name] = self.props[name];
    });
    this.componentProps.fromState.forEach((name) => {
      props[name] = self.state[name];
    });
    this.componentProps.fromThis.forEach((name) => {
      props[name] = self[name];
    });
    Object.keys(this.parser).forEach((key) => {
      props[key] = this.parser[key](self[key]);
    });
    return props;
  };

  getWrapperClassName() {
    const classes = ['ft-FlatDatePicker'];
    if (this.props.modifier) {
      classes.push(`ft-FlatDatePicker_${this.props.modifier}`);
    } else {
      classes.push(`ft-FlatDatePicker_${this.props.viewMode}`);
    }
    if (this.props.className) {
      classes.push(this.props.className);
    }
    return classes.join(' ');
  }

  render() {
    const className = this.getWrapperClassName();
    const componentProps = this.getComponentProps();
    const { viewMode, labels = {} } = this.props;
    return (
      <div className={className}>
        {/Y/.test(viewMode) && (
          <YearView
            {...componentProps}
            label={labels.year}
            onClick={this.handleClick}
          />
        )}
        {/M/.test(viewMode) && (
          <MonthView
            {...componentProps}
            label={labels.month}
            onClick={this.handleClick}
          />
        )}
        {/D/.test(viewMode) && (
          <DayView
            {...componentProps}
            label={labels.day}
            onClick={this.handleClick}
          />
        )}
        {/H/.test(viewMode) && (
          <HourView
            {...componentProps}
            label={labels.hour}
            onClick={this.handleClick}
          />
        )}
        {/m/.test(viewMode) && (
          <MinuteView
            {...componentProps}
            label={labels.minute}
            onClick={this.handleClick}
          />
        )}
      </div>
    );
  }
}

FlatDatePicker.propTypes = {
  className: PropTypes.string,
  modifier: PropTypes.string,
  viewDateFormat: PropTypes.string,
  locale: PropTypes.string,
  format: PropTypes.string,
  minuteStep: PropTypes.number,
  secondStep: PropTypes.number,
  autoConfirm: PropTypes.bool,
  pickerMode: PropTypes.oneOf(['history', 'normal', 'future']),
  viewMode: PropTypes.oneOf(['YMD', 'YM', 'Y', 'MD', 'Hm', 'YMDHm']),
  viewDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(moment),
    PropTypes.instanceOf(Date),
  ]),
  onChange: PropTypes.func.isRequired,
  originYear: PropTypes.number,
  yearRange: PropTypes.number,
  isValid: PropTypes.func,
  strictParsing: PropTypes.bool,
  minDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(moment),
  ]),

  maxDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(moment),
  ]),
  labels: PropTypes.shape({
    year: PropTypes.string,
    month: PropTypes.string,
    day: PropTypes.string,
    hour: PropTypes.string,
    minute: PropTypes.string,
  }),
  feedBack: PropTypes.func,
};

FlatDatePicker.defaultProps = {
  pickerMode: 'normal',
  viewMode: 'YMD',
  format: 'YYYY-MM-DD',
  minuteStep: 5,
  secondStep: 1,
  defaultValue: '',
};

export default FlatDatePicker;
