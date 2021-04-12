import { combineReducers } from 'redux';
import { createBlockReducer, mapHandleActions } from '@/utils/reducerCreators';

import { handleActions } from 'redux-actions';
import {
  fetchCategories,
  fetchCategoryFeed,
  fetchMostReadList,
  fetchMostCommentedList,
  fetchMostModifiedList,
  fetchMostTrackList,
  fetchTopScoredList,
  updateCategoryFilter,
  setSectionTemplates,
} from './actions';

const mostRead = createBlockReducer(fetchMostReadList);
const mostCommented = createBlockReducer(fetchMostCommentedList);
const mostModified = createBlockReducer(fetchMostModifiedList);
const mostTrack = createBlockReducer(fetchMostTrackList);
const topScored = createBlockReducer(fetchTopScoredList);

export const initialSectionState = {
  onceFetched: false,
  loading: false,
  error: null,
  data: null,
  templates: null,
};

const initialCategoryState = {
  loading: false,
  error: null,
  data: null,
  onceFetched: false,
  keyword: '',
};

const category = handleActions(
  {
    [fetchCategories.TRIGGER]: (state) => ({
      ...state,
      error: null,
      onceFetched: true,
    }),
    [fetchCategories.REQUEST]: (state) => {
      const nextState = {
        ...state,
        loading: true,
      };
      return nextState;
    },
    [fetchCategories.SUCCESS]: (state, action) => ({
      ...state,
      data: action.payload,
    }),
    [fetchCategories.FAILURE]: (state, action) => ({
      ...state,
      error: action.payload,
    }),
    [fetchCategories.FULFILL]: (state) => ({
      ...state,
      loading: false,
      onceFetched: true,
    }),
    [updateCategoryFilter]: (state, action) => ({
      ...state,
      keyword: action.payload,
    }),
  },
  initialCategoryState,
);

const sections = mapHandleActions(
  {
    [setSectionTemplates]: (state, action) => ({
      ...state,
      templates: action.payload.templates,
    }),
    [fetchCategoryFeed.TRIGGER]: (state) => ({
      ...state,
      error: null,
      onceFetched: true,
    }),
    [fetchCategoryFeed.REQUEST]: (state, action) => ({
      ...state,
      loading: true,
      data: action.payload.data,
      templates: action.payload.templates,
    }),
    [fetchCategoryFeed.SUCCESS]: (state, action) => ({
      ...state,
      data: action.payload.data,
      templates: action.payload.templates,
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
