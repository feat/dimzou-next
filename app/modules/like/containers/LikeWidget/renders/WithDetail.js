import React from 'react';
import PropTypes from 'prop-types';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import LikeButton from '@/components/LikeButton';

import intlMessages from '../messages';

function LikeWidgetWithDetail(props) {
  return (
    <div className="LikeWidget LikeWidget_withDetail">
      <LikeButton
        className="LikeWidget__btn"
        disabled={!props.isInitialized || !props.canLike}
        hasLiked={props.userHasLiked}
        onClick={props.onClick}
      />
      <div className="LikeWidget__wrap">
        <span className="LikeWidget__label">
          <TranslatableMessage message={intlMessages.label} />
        </span>
        <span className="LikeWidget__count">{props.likesCount}</span>
      </div>
    </div>
  );
}

LikeWidgetWithDetail.propTypes = {
  isInitialized: PropTypes.bool,
  canLike: PropTypes.bool,
  userHasLiked: PropTypes.bool,
  onClick: PropTypes.func,
  likesCount: PropTypes.number,
};

export default LikeWidgetWithDetail;
