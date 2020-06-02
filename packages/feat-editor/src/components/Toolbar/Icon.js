import React from 'react';
import PropTypes from 'prop-types';

const ToolbarIcon = (props) => {
  const { icon } = props;
  const svg = require(`!raw-loader!./icons/${icon}.svg`);
  return (
    <i
      className="toolbarIcon"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

ToolbarIcon.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default ToolbarIcon;
