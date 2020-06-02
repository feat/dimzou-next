import { mapHandleActions } from '@/utils/reducerCreators';

import { fetchUserInfo } from './actions';

export const REDUCER_KEY = 'user-info';

export const initialFetchState = {
  fetchedAt: null,
  onceFetched: false,
  fetching: false,
  fetchError: null,
};

const reducer = mapHandleActions(
  {
    [fetchUserInfo.TRIGGER]: (state, action) => ({
      ...state,
      data: action.payload.userId,
      onceFetched: true,
      fetchError: null,
    }),
    [fetchUserInfo.REQUEST]: (state) => ({
      ...state,
      fetching: true,
    }),
    [fetchUserInfo.SUCCESS]: (state, action) => ({
      ...state,
      data: action.payload.userId,
      fetchedAt: action.payload.fetchedAt,
    }),
    [fetchUserInfo.FAILURE]: (state, action) => ({
      ...state,
      fetchError: action.payload.data,
    }),
    [fetchUserInfo.FULFILL]: (state) => ({
      ...state,
      fetching: false,
    }),
  },
  initialFetchState,
  (action) => action.payload.userId,
);

export default reducer;
