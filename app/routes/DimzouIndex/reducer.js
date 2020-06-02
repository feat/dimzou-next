import { combineReducers } from 'redux';
import { createBlockReducer, mapHandleActions } from '@/utils/reducerCreators';

import {
  fetchCategories,
  fetchCategoryFeed,
  fetchMostReadList,
  fetchMostCommentedList,
  fetchMostModifiedList,
  fetchMostTrackList,
  fetchTopScoredList,
} from './actions';

const mostRead = createBlockReducer(fetchMostReadList);
const mostCommented = createBlockReducer(fetchMostCommentedList);
const mostModified = createBlockReducer(fetchMostModifiedList);
const mostTrack = createBlockReducer(fetchMostTrackList);
const topScored = createBlockReducer(fetchTopScoredList);
const category = createBlockReducer(fetchCategories);

const initialSectionState = {
  onceFetched: false,
  initialized: false,
  loading: false,
  error: null,
  data: null,
};

const sections = mapHandleActions(
  {
    [fetchCategoryFeed.TRIGGER]: (state) => ({
      ...state,
      error: null,
      onceFetched: true,
    }),
    [fetchCategoryFeed.REQUEST]: (state, action) => ({
      ...state,
      loading: true,
      data: action.payload.data,
    }),
    [fetchCategoryFeed.SUCCESS]: (state, action) => ({
      ...state,
      data: action.payload.data,
      onceFetched: true,
    }),
    [fetchCategoryFeed.FAILURE]: (state, action) => ({
      ...state,
      error: action.payload.data,
    }),
    [fetchCategoryFeed.FULFILL]: (state) => ({
      ...state,
      loading: false,
      initialized: true,
    }),
  },
  initialSectionState,
  (action) => action.payload.categoryId,
);

const reducer = combineReducers({
  category,
  sections,
  mostRead,
  mostCommented,
  mostModified,
  mostTrack,
  topScored,
});

export default reducer;

export const REDUCER_KEY = 'dimzou-index';
