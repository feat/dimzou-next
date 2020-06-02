import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@feat/feat-ui/lib/button';
import ButtonSelect from '@feat/feat-ui/lib/button-select';

import './style.scss';

class CountrySelect extends React.Component {
  getDropdownWidth(forceUpdate = false) {
    if (!forceUpdate && this.dropdownWidth) {
      return this.dropdownWidth;
    }
    if (this.trigger) {
      const triggerDom = ReactDOM.findDOMNode(this.trigger);
      this.dropdownWidth = triggerDom.getBoundingClientRect().width;
      // logging.info(this.dropdownWidth);
      return this.dropdownWidth;
    }
    return 300;
  }

  getValue() {
    const { value } = this.props;
    if (!value) {
      return null;
    }
    return value.iso3;
  }

  countryFilter = (option, filter) => {
    if (!filter) {
      return true;
    }
    const lfilter = filter.toLowerCase();
    return (
      (option.label && option.label.toLowerCase().indexOf(lfilter) > -1) ||
      String(option.calling_code)
        .toLowerCase()
        .indexOf(lfilter) > -1
    );
  };

  valueExtractor = (option) => option.iso3;

  renderTrigger = (value, option) => {
    const { placeholder } = this.props;
    return (
      <Button
        size="md"
        block
        className="t-left"
        ref={(n) => {
          this.trigger = n;
        }}
      >
        {option &&
          option.flag && (
          <img
            style={{ width: 20, height: 'auto', marginRight: 12 }}
            src={option.flag}
            alt={option.label}
          />
        )}
        <span>{option ? option.label : placeholder}</span>
      </Button>
    );
  };

  renderOption = (option, meta) => (
    <button
      className={classNames('ft-CountrySelect__option', 't-left', {
        'is-focused': meta.isFocused,
        'is-selected': meta.isSelected,
      })}
      type="button"
    >
      <img
        className="ft-CountrySelect__flag"
        src={option.flag}
        alt={option.label}
      />
      <span className="ft-CountrySelect__label">{option.label}</span>
    </button>
  );

  render() {
    return (
      <ButtonSelect
        renderTrigger={this.renderTrigger}
        valueExtractor={this.valueExtractor}
        dropdownWidth={this.getDropdownWidth()}
        rowHeight={36}
        value={this.getValue()}
        onChange={this.props.onChange}
        options={this.props.options}
        showFilter
        renderOption={this.renderOption}
        filterOption={this.countryFilter}
        placement="bottomLeft"
        onOpen={this.props.onFocus}
        onClose={this.props.onBlur}
        dropdownHeight={400}
      />
    );
  }
}

CountrySelect.propTypes = {
  value: PropTypes.object,
  options: PropTypes.array,
  placeholder: PropTypes.node,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};

export default CountrySelect;
