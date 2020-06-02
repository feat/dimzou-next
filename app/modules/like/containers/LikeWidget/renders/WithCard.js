import React from 'react';
import PropTypes from 'prop-types';

import LikeButton from '@/components/LikeButton';

function LikeWidgetWithCard(props) {
  return (
    <div className="LikeWidget LikeWidget_withCard">
      <LikeButton
        className="LikeWidget__btn"
        disabled={!props.isInitialized || !props.canLike}
        hasLiked={props.userHasLiked}
        onClick={props.onClick}
      />
      <span>{props.likesCount}</span>
    </div>
  );
}

LikeWidgetWithCard.propTypes = {
  isInitialized: PropTypes.bool,
  canLike: PropTypes.bool,
  userHasLiked: PropTypes.bool,
  onClick: PropTypes.func,
  likesCount: PropTypes.number,
};

export default LikeWidgetWithCard;
