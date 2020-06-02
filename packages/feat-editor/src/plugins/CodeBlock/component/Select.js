import React from 'react';
import PropTypes from 'prop-types';

class Select extends React.PureComponent {
  render() {
    const { name, options, selected } = this.props;
    return (
      <select name={name} onChange={e => this.props.onChange(e.target.value)} value={selected}>
        {options.map(option => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Select;
