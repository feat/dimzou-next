import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const getStep = () => Math.random() * 0.02 + 0.005;
function PropgressBar(props) {
  const [value, setValue] = useState(0);

  useEffect(
    () => {
      const timer = setTimeout(() => {
        const next = Math.min(value + getStep(), 1);
        setValue(next);
      }, 300);
      return () => {
        clearTimeout(timer);
      };
    },
    [value],
  );

  const renderValue = Math.max(value, props.value);

  const percentage = `${(renderValue * 100).toFixed(2)}%`;

  return (
    <div className="dz-ProgressBar">
      <div className="dz-ProgressBar__inner" style={{ width: percentage }} />
    </div>
  );
}

PropgressBar.propTypes = {
  value: PropTypes.number,
};

export default PropgressBar;
