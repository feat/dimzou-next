import { mapHandleActions } from '@/utils/reducerCreators';

import { fetchCategoryFeeds } from './actions';
import { initialPageState } from './config';

export default mapHandleActions(
  {
    [fetchCategoryFeeds.TRIGGER]: (state) => ({
      ...state,
      error: null,
      onceFetched: true,
    }),
    [fetchCategoryFeeds.REQUEST]: (state) => ({
      ...state,
      loading: true,
    }),
    [fetchCategoryFeeds.SUCCESS]: (state, action) => {
      const { items, ...rest } = action.payload.data;
      return {
        ...state,
        items: [...state.items, ...items],
        ...rest,
      };
    },
    [fetchCategoryFeeds.FAILURE]: (state, action) => ({
      ...state,
      error: action.payload.data,
    }),
    [fetchCategoryFeeds.FULFILL]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  initialPageState,
  (action) => action.payload.categoryId,
);
