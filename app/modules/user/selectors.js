import get from 'lodash/get';
import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import { selectEntities } from '@/modules/entity/selectors';

import {
  user as userSchema,
  userInfo as userInfoSchema,
} from '@/schema';

import { REDUCER_KEY, initialFetchState } from './reducer';

export const selectUsername = (state, props) => {
  const entityMap = selectEntities(state);
  const { userId } = props;

  return get(
    entityMap,
    [userSchema.key, userId, 'username'],
    `${userId}`,
  );
};

export const makeSelectUser = () => createSelector(
  (_, props) => props.userId,
  (state) => state.entities,
  (id, entities) => {
    const denormalized = denormalize(id, userSchema, entities);
    if (typeof denormalized === 'object' ) {
      return denormalized;
    }
    return null;
  }
)

export const selectUser = (state, props) => {
  const { userId } = props;
  const denormalized = denormalize(userId, userSchema, state.entities);
  if (typeof denormalized === 'object' ) {
    return denormalized;
  }
  return null;
}

export const selectUserInfo = (state, props) => {
  const { userId } = props;
  const denormalized = denormalize(userId, userInfoSchema, state.entities);
  if (typeof denormalized === 'object' ) {
    return denormalized;
  }
  return null;
}

export const selectRequestState = (state, props) => get(state, [REDUCER_KEY, props.userId], initialFetchState);

export const selectAvailableInfo = (state, props) => {
  const { userId } = props;
  return get(state, ['entities', userInfoSchema.key, userId, 'hasData'], {});
}