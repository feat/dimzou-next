import { mapHandleActions } from '@/utils/reducerCreators';

import { fetchUserDimzous } from './actions';
import { initialListState } from './config';

const reducer = mapHandleActions(
  {
    [fetchUserDimzous.TRIGGER]: (state) => ({
      ...state,
      onceFetched: true,
      error: null,
    }),
    [fetchUserDimzous.REQUEST]: (state) => ({
      ...state,
      loading: true,
    }),
    [fetchUserDimzous.SUCCESS]: (state, action) => ({
      ...state,
      next: action.payload.next,
      templates: action.payload.templates,
      hasMore: !!action.payload.next,
      list: [...(state.list || []), ...action.payload.list],
    }),
    [fetchUserDimzous.FAILURE]: (state, action) => ({
      ...state,
      error: action.payload.data,
    }),
    [fetchUserDimzous.FULFILL]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  initialListState,
  (action) => action.payload.userId,
);

export default reducer;
