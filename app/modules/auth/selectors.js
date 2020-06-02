import { createSelector } from 'reselect';
import get from 'lodash/get';

import { user as userSchema } from '@/schema';
import defautlAvatar from '@/images/default-avatar.png';

import { REDUCER_KEY } from './reducer';

const selectAuthDomain = (state) => state[REDUCER_KEY];

export const selectCurrentUserId = (state) => {
  const subState = selectAuthDomain(state);
  return subState.user;
};

const selectUser = (state) => {
  const currentUserId = selectCurrentUserId(state);
  if (!currentUserId) {
    return null;
  }
  return get(state, ['entities', userSchema.key, String(currentUserId)]);
};

export const selectCurrentUser = createSelector(selectUser, (user) => {
  if (!user) {
    return {
      avatar: defautlAvatar,
    };
  }
  return user;
});

export const selectUserMeta = (state) => {
  const subState = selectAuthDomain(state);
  return subState.userMeta;
};

export const hasAuthedUser = createSelector(selectCurrentUserId, (userId) =>
  Boolean(userId),
);

export const selectIsAuthModalOpened = (state) => {
  const subState = selectAuthDomain(state);
  return subState.isAuthModalOpened;
};

export const selectNextAction = (state) => {
  const subState = selectAuthDomain(state);
  return subState.next;
};
