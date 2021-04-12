import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '@feat/feat-ui/lib/button';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import intlMessages from '../messages';

function CommentButton(props) {
  return (
    <Button
      type="merge"
      className={classNames({
        'is-active': props.isActive,
      })}
      onClick={props.onClick}
    >
      <TranslatableMessage message={intlMessages.commentLabel} />
    </Button>
  );
}

CommentButton.propTypes = {
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

export default CommentButton;
