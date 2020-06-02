import React from 'react';
import PropTypes from 'prop-types';

import FeatTab from './FeatTab';
import NormalTab from './NormalTab';

const componentMap = {
  normal: NormalTab,
  feat: FeatTab,
};

const Tab = ({ type, ...props }) => {
  const Compo = componentMap[type];
  return <Compo {...props} />;
};

Tab.propTypes = {
  type: PropTypes.oneOf(['normal', 'feat']),
};

Tab.defaultProps = {
  type: 'feat',
};

export default Tab;
