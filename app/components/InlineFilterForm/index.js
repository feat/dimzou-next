import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './style.scss';

function InlineFilterForm(props) {
  const [keyword, setKeyword] = useState(props.initialKeyword || '');
  return (
    <form
      className="InlineFilterForm"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(keyword);
      }}
    >
      <input
        className="InlineFilterForm__input"
        placeholder={props.placeholder}
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
      />
      <button aria-label="submit" type="submit" style={{ display: 'none' }} />
    </form>
  );
}

InlineFilterForm.propTypes = {
  initialKeyword: PropTypes.string,
  placeholder: PropTypes.string,
  onSubmit: PropTypes.func,
};

InlineFilterForm.defaultProps = {
  placeholder: 'Filter',
};

export default InlineFilterForm;
