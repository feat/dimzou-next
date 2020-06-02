import { combineReducers } from 'redux'
import update from 'immutability-helper';
import { mapHandleActions } from '@/utils/reducerCreators';

import { fetchUserDimzous, initDimzouView, fetchNodePublication } from './actions'

export const REDUCER_KEY = 'dimzou-view';

export const initialListState = {
  onceFetched: false,
  templates: [],
  list: undefined,
  next: undefined,
  loading: false,
  error: null,
  hasMore: true,
}
const userListReducer = mapHandleActions(
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
)

export const initialDimzouViewState = {
  loading: false,
  nodes: undefined,
  loaded: {},
  initialized: false,
  error: null,
};
const dimzouViewReducer = mapHandleActions(
  {
    [initDimzouView.TRIGGER]: (state) => ({
      ...state,
      error: null,
    }),
    [initDimzouView.REQUEST]: (state) => ({
      ...state,
      loading: true,
    }),
    [initDimzouView.SUCCESS]: (state, action) => {
      const { data } = action.payload;
      return update(state, {
        type: { $set: data.type },
        initialized: { $set: true },
        nodes: { $set: data.nodes },
        loaded: {
          [data.nodeId]: { $set: data.publicationId },
        },
      })
    },
    [initDimzouView.FAILURE]: (state, action) => ({
      ...state,
      error: action.payload.data,
    }),
    [initDimzouView.FULFILL]: (state) => ({
      ...state,
      loading: false,
    }),
    [fetchNodePublication.SUCCESS]: (state, action) => {
      const { data } = action.payload;
      return update(state, {
        loaded: {
          [data.nodeId]: { $set: data.publicationId },
        },
      })
    },
  }, 
  initialDimzouViewState,
  (action) => action.payload.bundleId
)

export default combineReducers({
  users: userListReducer,
  bundles: dimzouViewReducer,
})
