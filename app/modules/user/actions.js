import { createRoutine } from 'redux-saga-routines';
import { normalize } from 'normalizr'
import { userInfo as userInfoSchema } from '@/schema';

import {
  getUserInfo as getUserInfoRequest,
  getApplicationAvailableInfo,
} from './requests';

export const fetchUserInfo = createRoutine('USERS/FETCH_USER_INFO');

export const asyncFetchUserInfo = (payload, meta = {}) => async (dispatch) => {
  dispatch(fetchUserInfo.trigger(payload))
  try {
    dispatch(fetchUserInfo.request(payload))
    const { data } = await getUserInfoRequest(payload.userId, undefined, meta.headers);
    
    const { data: hasData } = await getApplicationAvailableInfo(payload.userId, undefined, meta.headers);
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
        data: process.browser ? err : {
          message: err.message,
        },
      }),
    );
    throw err;
  } finally {
    dispatch(fetchUserInfo.fulfill(payload));
  }
}