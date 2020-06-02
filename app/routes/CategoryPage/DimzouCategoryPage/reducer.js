import { mapHandleActions } from '@/utils/reducerCreators';

import { fetchCategoryFeeds } from './actions';

export const initialPageState = {
  loading: false,
  items: [],
  error: null,
  next: undefined,
  hasMore: true,
  onceFetched: false,
};

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

export const REDUCER_KEY = 'category-dimzou';
