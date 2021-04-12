import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';

function FieldTextEditable(props) {
  const valueRef = useRef(null);
  return (
    <ContentEditable
      html={props.value}
      onChange={(e) => {
        valueRef.current = e.target.value;
        props.onChange(e.target.value);
      }}
      onBlur={(e) => {
        // clean up html on blur
        if (
          valueRef.current &&
          valueRef.current !== e.currentTarget.innerText
        ) {
          props.onChange(e.currentTarget.innerText);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}
    />
  );
}

FieldTextEditable.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default FieldTextEditable;
