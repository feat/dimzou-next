import { createRoutine } from 'redux-saga-routines';
import { createAction } from 'redux-actions';
import { normalize } from 'normalizr';
import { user as userSchema, userInfo as userInfoSchema } from '@/schema';

import {
  getUserInfo,
  getUsersBasic,
  getApplicationAvailableInfo,
} from './requests';

export const fetchUserInfo = createRoutine('USERS/FETCH_USER_INFO');

export const asyncFetchUserInfo = (payload) => async (
  dispatch,
  _,
  { request },
) => {
  dispatch(fetchUserInfo.trigger(payload));
  try {
    dispatch(fetchUserInfo.request(payload));
    const { data } = await request(
      getUserInfo({
        id: payload.userId,
      }),
    );

    const { data: hasData } = await request(
      getApplicationAvailableInfo({
        params: {
          uid: payload.userId,
        },
      }),
    );
    data.hasData = hasData;

    const normalized = normalize(data, userInfoSchema);

    dispatch(
      fetchUserInfo.success({
        userId: payload.userId,
        entities: normalized.entities,
        fetchedAt: Date.now(),
      }),
    );
  } catch (err) {
    dispatch(
      fetchUserInfo.failure({
        userId: payload.userId,
        data: err,
      }),
    );
    throw err;
  } finally {
    dispatch(fetchUserInfo.fulfill(payload));
  }
};

export const fetchUsersBasic = createRoutine('USERS/FETCH_USERS_BASIC');
export const asyncFetchUsersBasic = (payload) => async (
  dispatch,
  _,
  { request },
) => {
  try {
    const { data } = await request(getUsersBasic(payload.userIds));
    const normalized = normalize(data, [userSchema]);
    dispatch(
      fetchUsersBasic.success({
        userIds: payload.userIds,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    logging.error(err);
  }
};

export const fetchUserBasic = createAction('USERS/FETCH_USER_BASIC');
