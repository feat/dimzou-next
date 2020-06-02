import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl } from 'react-intl'

import Button from '@feat/feat-ui/lib/button';

import intlMessages from '../messages';

function TextBtn(props) {
  const { intl: { formatMessage }} = props;
  return (
    <Button
      type={props.userHasLiked ? 'danger' : 'merge'}
      disabled={!props.isInitialized || !props.canLike}
      onClick={props.onClick}
    >
      {formatMessage(intlMessages.likeLabel)}
    </Button>
  );
}

TextBtn.propTypes = {
  isInitialized: PropTypes.bool,
  canLike: PropTypes.bool,
  userHasLiked: PropTypes.bool,
  onClick: PropTypes.func,
  intl: PropTypes.object,
};

export default injectIntl(TextBtn);
