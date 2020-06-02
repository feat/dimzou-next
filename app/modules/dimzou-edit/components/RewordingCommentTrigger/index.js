import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { formatMessage } from '@/services/intl';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import message from '@feat/feat-ui/lib/message';

import { selectRewordingCommentsCount, selectRewordingCommentsUserCount } from '../../selectors';
import intlMessages from '../../messages';
import commentIcon from '../../assets/icon-comment.svg';

import './style.scss';

function RewordingCommentTrigger(props) {
  const count = useSelector((state) => selectRewordingCommentsCount(state, props));
  const userCount = useSelector((state) => selectRewordingCommentsUserCount(state, props));

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      if (props.userLimit && userCount >= props.userLimit ) {
        message.info({
          content: formatMessage(intlMessages.commentLimit),
        })
        return;
      } 
      props.onClick();
    },
    [props.onClick, userCount, props.userLimit],
  )

  return (
    <div className="dz-RewordingCommentTrigger">
      <IconButton
        size="sm"
        isActive={props.isActive}
        onClick={handleClick}
      >
        <span 
          className="ft-SvgIcon" 
          dangerouslySetInnerHTML={{ __html: commentIcon }}
        />
      </IconButton>
      <span className="dz-RewordingCommentTrigger__count">
        {count === undefined ? props.initialCount : count}
      </span>
    </div>
  );
}

RewordingCommentTrigger.propTypes = {
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  userLimit: PropTypes.number,
  initialCount: PropTypes.number,
  // rewordingId: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number
  // ]),
};

RewordingCommentTrigger.defaultProps = {
  userLimit: 1, 
}

export default RewordingCommentTrigger;
