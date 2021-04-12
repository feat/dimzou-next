import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function Countdown(props) {
  const timerRef = useRef(null);
  const [left, setLeft] = useState(props.count);

  useEffect(
    () => {
      timerRef.current = setTimeout(() => {
        if (left === 0) {
          return;
        }
        const next = left - 1;
        setLeft(next);
        if (next === 0) {
          props.onFinished();
        }
      }, 1000);
      return () => {
        clearTimeout(timerRef.current);
      };
    },
    [left],
  );

  return (
    <span className={props.className} style={props.style}>
      ( {left}s )
    </span>
  );
}

Countdown.propTypes = {
  count: PropTypes.number,
  onFinished: PropTypes.func.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Countdown;
