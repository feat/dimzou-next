import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

function DropHint({ top = 0, left = 0, height }) {
  const [visible, setVisible] = useState(false);
  useEffect(
    () => {
      setVisible(false);
      const timer = setTimeout(() => {
        setVisible(true);
      }, 200);
      return () => {
        clearTimeout(timer);
      };
    },
    [top],
  );
  return (
    <div
      className="dz-DropHint"
      style={{
        height,
        top: top - height,
        opacity: visible ? 1 : 0,
        transition: visible ? 'opacity .1s ease' : undefined,
        left,
      }}
    />
  );
}

DropHint.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number,
  height: PropTypes.number,
};

export default DropHint;
