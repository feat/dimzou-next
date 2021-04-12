/**
 * 参与者信息展示组件，
 * 按需结合 react-dnd 使用
 */
import React, { useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

import { selectUser } from '@/modules/user/selectors';
import { fetchUserBasic } from '@/modules/user/actions';
import { getAvatar, getAppLink, getUsername } from '@/modules/user/utils';

import './style.scss';

const percentage = (num) => `${(num * 100).toFixed(2)}%`;

const Collaborator = forwardRef((props, ref) => {
  const { data, isDragging, nodeWords } = props;
  const { joined_at: joinedAt, user_id: userId, is_deleted: isDeleted } = data;
  const user = useSelector((state) => selectUser(state, { userId }));
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (!user) {
        dispatch(fetchUserBasic(userId));
      }
    },
    [userId],
  );

  if (!user) {
    return null;
  }

  return (
    <div
      className={classNames('dz-Collaborator', {
        'is-dragging': isDragging,
        'is-pending': !joinedAt,
        'is-archive': isDeleted,
      })}
      ref={ref}
    >
      <div className="dz-Collaborator__main">
        <img
          draggable={false}
          alt={getUsername(user)}
          className="dz-Collaborator__avatar"
          src={getAvatar(user, 'md')}
        />
        <div className="dz-Collaborator__info">
          <Link
            href={{
              pathname: '/user-profile',
              query: {
                userId: user.uid,
              },
            }}
            as={getAppLink(user)}
          >
            <a className="t-username margin_r_5">{getUsername(user)}</a>
          </Link>
          <div>
            <span className="t-meta t-meta_primary">{user.expertise}</span>
          </div>
        </div>
      </div>
      {/* <AvatarStamp
        avatar={getAvatar(user, 'md')}
        uiMeta={['expertise']}
        size="xs"
        online={user.is_online}
        username={
          
        }
        expertise={}
      /> */}
      {!!nodeWords && (
        <div className="dz-Collaborator__meta">
          {percentage(data.contributing_words / nodeWords)}{' '}
          {data.contributing_words}
        </div>
      )}
    </div>
  );
});

Collaborator.propTypes = {
  data: PropTypes.object,
  isDragging: PropTypes.bool,
  nodeWords: PropTypes.number,
};

Collaborator.displayName = 'Collaborator';

export default Collaborator;
