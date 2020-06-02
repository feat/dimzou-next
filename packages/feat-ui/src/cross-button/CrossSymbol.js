import React from 'react';
import PropTypes from 'prop-types';

export default function CrossSymbol(props) {
  const { width, height } = props;
  const style = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={style} className="crossSymbol">
      <line className="crossSymbol__line" x1="0" y1="0" x2={width} y2={height} stroke="black" strokeDasharray="5, 5" />
      <line className="crossSymbol__line" x1="0" y1={height} x2={width} y2="0" stroke="black" strokeDasharray="5, 5" />
    </svg>
  );
}

CrossSymbol.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
