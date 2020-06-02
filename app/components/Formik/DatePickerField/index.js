import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// import { FieldProps } from 'formik';

import Popover from '@feat/feat-ui/lib/popover';
import Button from '@feat/feat-ui/lib/button';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
import FormItem from '@feat/feat-ui/lib/form/FormItem';
import FlatDatePicker from '@feat/feat-ui/lib/flat-date-picker';
import FormLabel from '@feat/feat-ui/lib/form/FormLabel';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';

import DatePickerLabel from './DatePickerLabel';

import getValidateStatus from '../helpers/getValidateStatus';

class DatePickerField extends React.PureComponent {
  handleChange = (date) => {
    const {
      form: { setFieldValue },
      field: { name },
    } = this.props;
    setFieldValue(name, date);
    if (this.props.autoCloseOnChange && this.popover) {
      this.popover.closePortal();
    }
  };

  handleReset = (e) => {
    e.stopPropagation();
    const {
      form: { setFieldValue },
      field: { name },
    } = this.props;
    setFieldValue(name, null);
  };

  render() {
    const {
      field,
      form,
      label,
      help,
      placeholder,
      momentFormat,
      modifier,
      renderLabel,
      renderPickerLabel: PickerLabel,
      ...custom
    } = this.props;
    const validateStatus = getValidateStatus(this.props);
    let defaultValue;

    // const touched = form.touched[field.name];
    const dirty = false;
    const error = form.errors[field.name];

    if (!dirty && field.value) {
      defaultValue = moment(field.value, momentFormat);
    }

    return (
      <FormItem
        renderLabel={renderLabel}
        label={<FormLabel>{label}</FormLabel>}
        help={
          validateStatus === 'error' ? (
            <FormHelp data={error} validateStatus="error" />
          ) : (
            help && <FormHelp data={help} />
          )
        }
        validateStatus={validateStatus}
        modifier={modifier}
        className={custom.className}
      >
        {({ handleFocus, handleBlur, hasFocus }) => (
          <Popover
            placement={custom.placement}
            trigger={custom.trigger}
            ref={(n) => {
              this.popover = n;
            }}
            content={
              <div
                style={
                  custom.isMobile
                    ? { width: '80vw' }
                    : custom.popLayerContainerStyle
                }
              >
                <FlatDatePicker
                  yearRange={custom.yearRange}
                  pickerMode={custom.pickerMode}
                  viewMode={custom.viewMode}
                  minDate={custom.minDate}
                  maxDate={custom.maxDate}
                  defaultValue={defaultValue}
                  format={momentFormat}
                  onChange={this.handleChange}
                />
              </div>
            }
            onOpen={handleFocus}
            onClose={handleBlur}
            isMobile={custom.isMobile}
          >
            <div style={{ display: 'flex' }}>
              <Button className="t-left" block>
                <PickerLabel
                  value={field.value}
                  hasFocus={hasFocus}
                  format={momentFormat}
                  placeholder={placeholder}
                />
              </Button>
              {custom.canClear &&
                field.value && (
                <SquareButton onClick={this.handleReset}>
                    &times;
                </SquareButton>
              )}
            </div>
          </Popover>
        )}
      </FormItem>
    );
  }
}

DatePickerField.propTypes = {
  form: PropTypes.object,
  field: PropTypes.object,
  label: PropTypes.node,
  placeholder: PropTypes.node,
  momentFormat: PropTypes.string,
  yearRange: PropTypes.number,
  renderLabel: PropTypes.func,
  help: PropTypes.string,
  viewMode: PropTypes.string,
  modifier: PropTypes.string,
  renderPickerLabel: PropTypes.func,
  canClear: PropTypes.bool,
  autoCloseOnChange: PropTypes.bool,
  pickerMode: PropTypes.string,
  popLayerContainerStyle: PropTypes.object,
  placement: PropTypes.string,
  trigger: PropTypes.string,
};

DatePickerField.defaultProps = {
  pickerMode: 'history',
  yearRange: 72,
  momentFormat: 'YYYY-MM-DD',
  renderPickerLabel: DatePickerLabel,
  placement: 'bottomLeft',
  trigger: 'click',
  canClear: false,
};

export default DatePickerField;
