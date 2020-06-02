import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// import { FieldProps } from 'formik';

import Button from '@feat/feat-ui/lib/button';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import Popover from '@feat/feat-ui/lib/popover';
import FlatDatePicker from '@feat/feat-ui/lib/flat-date-picker/FlatRangePicker';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';

const getDefaultValues = (props) => {
  const {
    fieldMap: { start, end },
    momentFormat,
    field: { value },
  } = props;

  const defaultValues = [];

  const startValue = value[start];
  const endValue = value[end];
  if (startValue) {
    defaultValues.push(moment(startValue, momentFormat));
  }
  if (endValue) {
    defaultValues.push(moment(endValue, momentFormat));
  }
  return defaultValues;
};

class RangeField extends Component {
  onChange = (dates) => {
    const {
      fieldMap: { start, end },
      normalize,
      form: { setFieldValue },
      field: { name },
    } = this.props;

    const mapped = {
      [start]: normalize(dates[0]),
      [end]: normalize(dates[1]),
    };

    setFieldValue(name, mapped);

    // const startField = this.props[start];
    // const endField = this.props[end];
    // const normalizedStart = normalize(dates[0]);
    // const normalizedEnd = normalize(dates[1]);

    // if (!normalizedStart.isSame(startField.input.value)) {
    //   startField.input.onChange(normalizedStart);
    // }
    // if (!normalizedEnd.isSame(endField.input.value)) {
    //   endField.input.onChange(normalizedEnd);
    // }
    if (this.popover && this.props.autoCloseOnChange) {
      this.popover.closePortal();
    }
  };

  defaultValue = getDefaultValues(this.props);

  render() {
    const {
      className,
      label,
      fieldMap: { start, end },
      placeholder,
      momentFormat,
      modifier,
      placement,
      isMobile,
      field,
    } = this.props;

    return (
      <FormItem
        className={className}
        label={<FormLabel>{label}</FormLabel>}
        modifier={modifier}
      >
        {({ handleFocus, handleBlur }) => (
          <Popover
            placement={placement}
            trigger="click"
            ref={(n) => {
              this.popover = n;
            }}
            content={
              <div style={{ minWidth: 300, maxWidth: 400 }}>
                <FlatDatePicker
                  yearRange={72}
                  pickerMode={this.props.pickerMode}
                  viewMode={this.props.viewMode}
                  defaultValue={this.defaultValue}
                  format={momentFormat}
                  onChange={this.onChange}
                />
              </div>
            }
            onOpen={handleFocus}
            onClose={handleBlur}
            isMobile={isMobile}
          >
            <Button className="t-left" block>
              {this.props.renderPickerLabel({
                start: field.value[start],
                end: field.value[end],
                format: momentFormat,
                placeholder,
              })}
            </Button>
          </Popover>
        )}
      </FormItem>
    );
  }
}

RangeField.propTypes = {
  // ...FieldProps,
  form: PropTypes.object,
  field: PropTypes.object,
  className: PropTypes.string,
  modifier: PropTypes.string,
  viewMode: PropTypes.string,
  pickerMode: PropTypes.string,
  fieldMap: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }),
  normalize: PropTypes.func,
  renderPickerLabel: PropTypes.func,
  label: PropTypes.node,
  placeholder: PropTypes.node,
  momentFormat: PropTypes.string,
  autoCloseOnChange: PropTypes.bool,
  placement: PropTypes.string,
  isMobile: PropTypes.bool,
};

RangeField.defaultProps = {
  fieldMap: { start: 'start', end: 'end' },
  normalize: (val) => val,
  renderPickerLabel: ({ start, end, format, placeholder }) => {
    if (start && end) {
      return `${start.format(format)} -- ${end.format(format)}`;
    }
    return placeholder;
  },
  pickerMode: 'history',
  placement: 'bottomLeft',
};

export default RangeField;
