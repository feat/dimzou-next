import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import classNames from 'classnames';

import FlatDatePicker from './FlatDatePicker';
import Button from '../button/Button';

class FlatRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickerTarget: 'start',
      start: undefined,
      end: undefined,
      startDate: undefined,
      endDate: undefined,
      yearFormat: '',
      monthFormat: '',
      dayFormat: '',
      hourFormat: '',
      minuteFormat: '',
    };
    this.handleDatePicker = this.handleDatePicker.bind(this);
    this.targetStart = this.targetStart.bind(this);
    this.targetEnd = this.targetEnd.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const _compo = this;
    if (this.state.pickerTarget !== prevState.pickerTarget) {
      this.picker.reset();
    }
    if (
      this.props.autoConfirm &&
      this.state.start &&
      this.state.end &&
      (prevState.start !== this.state.start || prevState.end !== this.state.end)
    ) {
      // fix pausing bug;
      window.setTimeout(() => {
        _compo.props.onChange(
          [_compo.state.start.moment, _compo.state.end.moment],
          [_compo.state.start.dateString, _compo.state.end.dateString],
        );
      }, 10);
    }
  }

  targetStart(e) {
    e.preventDefault();
    this.setState({ pickerTarget: 'start' });
  }

  targetEnd(e) {
    e.preventDefault();
    this.setState({ pickerTarget: 'end' });
  }

  handleDatePicker(m, dateString) {
    const newState = {
      [this.state.pickerTarget]: {
        moment: m,
        dateString,
      },
    };
    if (this.state.pickerTarget === 'start' && this.state.end === undefined) {
      newState.pickerTarget = 'end';
    } else if (
      this.state.pickerTarget === 'end' &&
      this.state.start === undefined
    ) {
      newState.pickerTarget = 'start';
    }
    this.setState(newState);
    this.setState({
      startDate: undefined,
      endDate: undefined,
      yearFormat: '',
      monthFormat: '',
      dayFormat: '',
      hourFormat: '',
      minuteFormat: '',
    });
  }

  reset() {
    this.setState({
      pickerTarget: 'start',
      start: undefined,
      end: undefined,
    });
    this.picker.reset();
  }

  isValid(m, view, isMinView) {
    let isValid = true;
    const { start, end, pickerTarget } = this.state;
    let startMoment;
    let endMoment;
    if (start) {
      startMoment = start.moment.clone();
    }
    if (end) {
      endMoment = end.moment.clone();
    }
    if (pickerTarget === 'start' && endMoment) {
      isValid = isMinView
        ? m.isSameOrBefore(endMoment)
        : m.isSameOrBefore(endMoment.startOf(view));
    }
    if (pickerTarget === 'end' && startMoment) {
      isValid = isMinView
        ? m.isSameOrAfter(startMoment)
        : m.isSameOrAfter(startMoment.startOf(view));
    }
    return isValid;
  }

  autoFeedBack = (date, key) => {
    const { format } = this.props;
    const reg = /\W+/;
    const f = format.split(reg);

    if (this.state.pickerTarget === 'start') {
      this.setState({ startDate: date, endDate: undefined });
    } else {
      this.setState({ startDate: undefined, endDate: date });
    }
    switch (key) {
      case 'year':
        const yearFormat = f.find((item) => /Y/.test(item));
        this.setState({ yearFormat });
        break;
      case 'month':
        const monthFormat = f.find((item) => /M/.test(item));
        this.setState({ monthFormat });
        break;
      case 'day':
        const dayFormat = f.find((item) => /D/.test(item));
        this.setState({ dayFormat });
        break;
      case 'hour':
        const hourFormat = f.find((item) => /H/i.test(item));
        this.setState({ hourFormat });
        break;
      case 'minute':
        const minuteFormat = f.find((item) => /m/.test(item));
        this.setState({ minuteFormat });
        break;

      default:
        break;
    }
  };

  render() {
    const {
      pickerTarget,
      start,
      end,
      startDate,
      endDate,
      yearFormat,
      monthFormat,
      dayFormat,
      hourFormat,
      minuteFormat,
    } = this.state;
    const startStr = start && start.dateString;
    const endStr = end && end.dateString;
    const modifier = this.props.modifier || this.props.viewMode;
    return (
      <div className={`ft-FlatRangePicker ft-FlatRangePicker_${modifier}`}>
        <div className="ft-FlatRangePicker__display">
          <Button
            className={classNames('ft-FlatRangePicker__dsCompo', {
              'is-active': pickerTarget === 'start',
            })}
            onClick={this.targetStart}
          >
            {startDate ? (
              <span style={{ color: '#999' }}>
                {yearFormat && `${startDate.format(yearFormat)} `}
                {monthFormat && `${startDate.format(monthFormat)} `}
                {dayFormat && `${startDate.format(dayFormat)} `}
                {hourFormat && `${startDate.format(hourFormat)}:`}
                {minuteFormat && `${startDate.format(minuteFormat)} `}
              </span>
            ) : (
              <span>{startStr}</span>
            )}
          </Button>
          <span className="ft-FlatRangePicker__dsSeparator">--</span>
          <Button
            className={classNames('ft-FlatRangePicker__dsCompo', {
              'is-active': pickerTarget === 'end',
            })}
            onClick={this.targetEnd}
          >
            {endDate ? (
              <span style={{ color: '#999' }}>
                {yearFormat && `${endDate.format(yearFormat)} `}
                {monthFormat && `${endDate.format(monthFormat)} `}
                {dayFormat && `${endDate.format(dayFormat)} `}
                {hourFormat && `${endDate.format(hourFormat)}:`}
                {minuteFormat && `${endDate.format(minuteFormat)} `}
              </span>
            ) : (
              <span>{endStr}</span>
            )}
          </Button>
        </div>
        <FlatDatePicker
          {...this.props}
          viewDate={
            this.state.start ? this.state.start.moment : this.props.viewDate
          }
          minDate={
            this.state.start ? this.state.start.moment : this.props.minDate
          }
          autoConfirm
          ref={(c) => {
            this.picker = c;
          }}
          onChange={this.handleDatePicker}
          isValid={this.isValid}
          feedBack={this.autoFeedBack}
        />
      </div>
    );
  }
}

FlatRangePicker.defaultProps = {
  autoConfirm: true,
};

FlatRangePicker.propTypes = {
  modifier: PropTypes.string,
  viewMode: PropTypes.string,
  autoConfirm: PropTypes.bool,
  labels: PropTypes.object,
  viewDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(moment),
    PropTypes.instanceOf(Date),
  ]),
  minDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(moment),
    PropTypes.instanceOf(Date),
  ]),
  format: PropTypes.string,
};

export default FlatRangePicker;
