import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';
import { ReactComponent as CloseIcon } from '@/assets/icons/close.svg';

import './style.scss';

export default function BackButton({ style, className }) {
  const shouldDisplay = global && global.history && global.history.length > 1;
  if (!shouldDisplay) {
    return null;
  }
  return (
    <ButtonBase
      className={classNames('BackBtn', 'size_sm', className)}
      style={style}
      onClick={() => {
        global.history.back();
      }}
    >
      <CloseIcon />
    </ButtonBase>
  );
}

BackButton.propTypes = {
  // to: PropTypes.string.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
};
