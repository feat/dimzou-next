import React from 'react';
import PropTypes from 'prop-types';

const CoverPlaceholder = (props) => {
  const style = {
    width: '100%',
    paddingTop: `${100 / props.ratio}%`,
    background: '#f4f4f4',
  };
  if (props.image) {
    style.backgroundImage = `url(${props.image})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
  }

  return (
    <div
      // className="dz-CoverPreview__image"
      style={style}
    />
  );
};

CoverPlaceholder.propTypes = {
  ratio: PropTypes.number,
  image: PropTypes.string,
};

export default CoverPlaceholder;
