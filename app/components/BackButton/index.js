import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconButton from '@feat/feat-ui/lib/button/IconButton';

import './style.scss';

export default function BackButton({ style, className }) {
  const shouldDisplay = global && global.history && global.history.length > 1;
  if (!shouldDisplay) {
    return null;
  }
  return (
    <IconButton
      className={classNames('BackBtn', className)}
      style={style}
      size="sm"
      svgIcon="close"
      onClick={() => {
        global.history.back();
      }}
    />
  );
}

BackButton.propTypes = {
  // to: PropTypes.string.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
};
