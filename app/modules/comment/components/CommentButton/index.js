import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';

import CommentIcon from '../CommentIcon';
import './style.scss';

function CommentButton(props) {
  return (
    <ButtonBase
      className={classNames('CommentButton', 'size_xs', props.className, {
        'is-active': props.isActive,
      })}
      onClick={props.onClick}
    >
      <CommentIcon className={props.iconClassName} />
    </ButtonBase>
  );
}

CommentButton.propTypes = {
  className: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  iconClassName: PropTypes.string,
};

CommentButton.defaultProps = {};

export default CommentButton;
