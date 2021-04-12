import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { selectCurrentUser } from '@/modules/auth/selectors';
import { LIKABLE_TYPE_DIMZOU_PUBLICATION } from '@/modules/like/constants';
import LikeWidget from '@/modules/like/containers/LikeWidget';

function LikeButton(props) {
  const { publication } = props;
  const currentUser = useSelector(selectCurrentUser);

  const capabilities = useMemo(
    () => ({
      canLike:
        currentUser &&
        publication.author &&
        currentUser.uid !== publication.author.uid,
    }),
    [publication, currentUser],
  );

  return (
    <LikeWidget
      entityType={LIKABLE_TYPE_DIMZOU_PUBLICATION}
      entityId={publication.id}
      capabilities={capabilities}
      initialData={{
        userHasLiked: publication.current_user_has_liked,
        likes: publication.likes
          ? publication.likes.map((item) => item.id)
          : [],
        likesCount: publication.likes_count || 0,
      }}
      // type="withDetail"
      type="textBtn"
    />
  );
}
LikeButton.propTypes = {
  publication: PropTypes.object,
};
export default LikeButton;
