import React from 'react';
import PropTypes from 'prop-types';

import FIcon from '@/components/FIcon';
import './style.scss';

function SplashView(props) {
  return (
    <div className="SplashView">
      <div className="SplashView__inner">
        <div className="SplashView__logo">
          <FIcon />
        </div>
        <div className="SplashView__hint">{props.hint}</div>
      </div>
    </div>
  );
}

SplashView.propTypes = {
  hint: PropTypes.node,
};

SplashView.defaultProps = {
  hint: 'Loading ...',
};

export default SplashView;
