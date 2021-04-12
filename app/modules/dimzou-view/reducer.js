import { combineReducers } from 'redux';
import { mapHandleActions } from '@/utils/reducerCreators';

import { fetchBundlePublicationMeta, fetchNodePublication } from './actions';
import { initialMetaState, initialContentState } from './config';

const metaReducer = mapHandleActions(
  {
    [fetchBundlePublicationMeta.TRIGGER]: (state) => ({
      ...state,
      onceFetched: true,
      fetchError: null,
    }),
    [fetchBundlePublicationMeta.REQUEST]: (state) => ({
      ...state,
      loading: true,
    }),
    [fetchBundlePublicationMeta.SUCCESS]: (state, action) => ({
      ...state,
      data: action.payload.data,
    }),
    [fetchBundlePublicationMeta.FAILURE]: (state, action) => ({
      ...state,
      fetchError: action.payload.data,
    }),
    [fetchBundlePublicationMeta.FULFILL]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  initialMetaState,
  (action) => action.payload.bundleId,
);

const contentReducer = mapHandleActions(
  {
    [fetchNodePublication.TRIGGER]: (state) => ({
      ...state,
      fetchError: null,
      onceFetched: true,
    }),
    [fetchNodePublication.REQUEST]: (state) => ({
      ...state,
      loading: true,
    }),
    [fetchNodePublication.SUCCESS]: (state, action) => ({
      ...state,
      data: action.payload.data,
    }),
    [fetchNodePublication.FAILURE]: (state, action) => ({
      ...state,
      fetchError: action.payload.data,
    }),
    [fetchNodePublication.FULFILL]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  initialContentState,
  (action) => action.payload.nodeId,
);

export default combineReducers({
  meta: metaReducer,
  content: contentReducer,
});
