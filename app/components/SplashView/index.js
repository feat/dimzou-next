import React from 'react';
import PropTypes from 'prop-types';

import fIcon from '@/images/f.svg';
import './style.scss';

function SplashView(props) {
  return (
    <div className="SplashView">
      <div className="SplashView__inner">
        <div
          className="SplashView__logo"
          dangerouslySetInnerHTML={{ __html: fIcon }}
        />
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
