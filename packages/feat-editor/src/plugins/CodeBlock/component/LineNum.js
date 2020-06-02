import React from 'react';
import PropTypes from 'prop-types';

export default function LineNum(props) {
  const linesCount = (props.text || '').split('\n').length;
  return (
    <div className="public-DraftStyleDefault-codeBlock-lineNumbers">
      {[...new Array(linesCount)].map((_, i) => (
        <span />
      ))}
    </div>
  );
}

LineNum.propTypes = {
  text: PropTypes.string.isRequired,
};
