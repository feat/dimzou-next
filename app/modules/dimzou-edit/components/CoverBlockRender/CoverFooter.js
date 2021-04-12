import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';
import LikeButton from '@/components/LikeButton';
import Icon from '../Icon';

import {
  BLOCK_EXPANDED_SECTION_COMMENTS,
  BLOCK_EXPANDED_SECTION_VERSIONS,
} from '../../constants';

const CoverFooter = (props) => {
  const {
    isExpanded,
    onToggle,
    candidateCount,
    historyCount,
    commentsCount,
    like,
    unlike,
    expandedType,
    currentUserHasLiked,
    likesCount,
  } = props;
  return (
    <div className="dz-CoverFooter">
      <span className="margin_r_36">
        <ButtonBase
          className={classNames('margin_r_5', {
            'is-active':
              isExpanded && expandedType === BLOCK_EXPANDED_SECTION_VERSIONS,
          })}
          onClick={() => onToggle(BLOCK_EXPANDED_SECTION_VERSIONS)}
        >
          <Icon name="reword" className="size_xs" />
        </ButtonBase>
        {candidateCount}/{historyCount}
      </span>
      <span className="margin_r_36">
        <ButtonBase
          className={classNames('margin_r_5', {
            'is-active':
              isExpanded && expandedType === BLOCK_EXPANDED_SECTION_COMMENTS,
          })}
          onClick={() => onToggle(BLOCK_EXPANDED_SECTION_COMMENTS)}
        >
          <Icon name="comment" className="size_xs" />
        </ButtonBase>
        {commentsCount || 0}
      </span>
      <span className="margin_r_24">
        <LikeButton
          className="margin_r_5"
          onClick={currentUserHasLiked ? unlike : like}
          hasLiked={currentUserHasLiked}
        />
        {likesCount || 0}
      </span>
    </div>
  );
};

CoverFooter.propTypes = {
  candidateCount: PropTypes.number,
  historyCount: PropTypes.number,
  commentsCount: PropTypes.number,
  likesCount: PropTypes.number,
  isExpanded: PropTypes.bool,
  expandedType: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
  like: PropTypes.func.isRequired,
  unlike: PropTypes.func.isRequired,
  currentUserHasLiked: PropTypes.bool,
};

export default CoverFooter;
