import { handleActions } from 'redux-actions';

import { fetchUserCategories, createCategory } from './actions';

const initialState = {
  userCategories: undefined,
  userCategoriesError: null,
  isFetchingUserCategories: false,
};

const reducer = handleActions(
  {
    [fetchUserCategories.TRIGGER]: (state) => ({
      ...state,
      userCategoriesError: null,
    }),
    [fetchUserCategories.REQUEST]: (state) => ({
      ...state,
      isFetchingUserCategories: true,
    }),
    [fetchUserCategories.FAILURE]: (state, action) => ({
      ...state,
      userCategoriesError: action.payload,
    }),
    [fetchUserCategories.SUCCESS]: (state, action) => ({
      ...state,
      userCategories: action.payload.list,
    }),
    [fetchUserCategories.FULFILL]: (state) => ({
      ...state,
      isFetchingUserCategories: false,
    }),
    [createCategory.SUCCESS]: (state, action) => ({
      ...state,
      userCategories: [
        ...(state.userCategories || []),
        action.payload.categoryId,
      ],
    }),
  },
  initialState,
);

export default reducer;

export const REDUCER_KEY = 'category';
