import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FieldProps } from 'formik';

import ButtonSelect from '@feat/feat-ui/lib/button-select';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import Button from '@feat/feat-ui/lib/button';

import './style.scss';

const countryFilter = (option, filter) => {
  if (!filter) {
    return true;
  }
  const lfilter = filter.toLowerCase();

  return (
    option.name.toLowerCase().indexOf(lfilter) > -1 ||
    String(option.callingCode)
      .toLowerCase()
      .indexOf(lfilter) > -1
  );
};

class CountrySelectField extends React.Component {
  state = {
    isFocused: false,
  };

  getDropdownWidth() {
    if (this.selectWrap) {
      return this.selectWrap.clientWidth;
    }
    return 300;
  }

  handleChange = (_, option) => {
    const {
      field: { name },
      form: { setFieldValue },
    } = this.props;
    setFieldValue(name, option);
    if (this.props.afterChange) {
      this.props.afterChange(option);
    }
  };

  handleFocus = () => {
    this.setState({
      isFocused: true,
    });
  };

  handleBlur = () => {
    const {
      field: { name },
      form: { setFieldTouched },
    } = this.props;
    this.setState({
      isFocused: false,
    });
    setFieldTouched(name);
  };

  renderCountryOption = (option, meta) => (
    <div
      className={classNames('CountrySelect__option', {
        'is-focused': meta.isFocused,
        'is-selected': meta.isSelected,
      })}
    >
      <img
        src={option.flag}
        alt={option.name}
        className="CountrySelect__flag"
      />
      <span>
        {option.name} ( {option.callingCode} )
      </span>
    </div>
  );

  renderTrigger = () => {
    const { callingCode, field } = this.props;
    let label;
    if (field.value) {
      label = <span>{field.value.name}</span>;
    } else if (!field.value && callingCode) {
      label = this.props.invalidCallingCodeLabel;
    } else {
      label = this.props.placeholder;
    }

    return (
      <div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
          }}
          // onClick={() => {
          //   setTimeout(() => {
          //     const dom = document.querySelector('.ft-ButtonSelect__filter');
          //     if (dom != null) {
          //       dom.focus();
          //     }
          //   });
          // }}
        />
        <Button size="lg" className="CountrySelect" block type="merge">
          {field.value && (
            <img
              className="CountrySelect__flag"
              alt={field.value.calling_code}
              src={field.value.flag}
            />
          )}
          {label}
        </Button>
      </div>
    );
  };

  render() {
    const {
      field,
      form,
      label,
      countryOptions,
      callingCode,
      ...custom
    } = this.props;
    const touched = form.touched[field.name];
    const error = form.errors[field.name];

    return (
      <div
        className={classNames('st-FormItem', {
          'has-focus': this.state.isFocused,
          'has-error': !!error,
          'has-touched': touched,
        })}
      >
        <div className="st-FormItem__label">{label}</div>
        <div
          className="st-FormItem__wrapper"
          ref={(n) => {
            this.selectWrap = n;
          }}
          // onClick={() => {
          //   setTimeout(() => {
          //     const dom = document.querySelector('.ft-ButtonSelect__filter');
          //     if (dom != null) {
          //       dom.focus();
          //     }
          //   });
          // }}
        >
          <ButtonSelect
            renderTrigger={this.renderTrigger}
            valueExtractor={(option) => option.id}
            dropdownWidth={this.getDropdownWidth()}
            rowHeight={40}
            value={field.value ? field.value.id : undefined}
            onChange={this.handleChange}
            placeholder={custom.placeholder}
            options={countryOptions}
            showFilter
            renderOption={this.renderCountryOption}
            filterOption={countryFilter}
            placement="bottomLeft"
            onOpen={this.handleFocus}
            onClose={this.handleBlur}
          />
        </div>
        {touched &&
          error && (
          <div className="st-FormItem__error">
            <FormHelp data={error} validateStatus="error" />
          </div>
        )}
      </div>
    );
  }
}

CountrySelectField.propTypes = {
  ...FieldProps,
  countryOptions: PropTypes.array,
  afterChange: PropTypes.func,
  label: PropTypes.node,
  callingCode: PropTypes.string,
  placeholder: PropTypes.node,
  invalidCallingCodeLabel: PropTypes.node,
};

export default CountrySelectField;
