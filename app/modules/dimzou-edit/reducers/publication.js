import { combineReducers } from 'redux';
import { mapHandleActions } from '@/utils/reducerCreators';
import { fetchBundlePublication, fetchBundleDesc } from '../actions';

const initialNodeState = {
  data: null,
  isFetching: false,
  fetchError: null,
  fetchedAt: null,
};

const initialBundleState = {
  onceFetched: false,
  isFetchingDesc: false,
  fetchedAt: null,
  fetchError: null,
  data: null,
  nodes: {},
};

const bundleDescReducer = mapHandleActions(
  {
    [fetchBundleDesc.TRIGGER]: (state) => ({
      ...state,
      fetchError: null,
    }),
    [fetchBundleDesc.REQUEST]: (state) => ({
      ...state,
      isFetchingDesc: true,
    }),
    [fetchBundleDesc.SUCCESS]: (state, action) => ({
      ...state,
      data: action.payload.bundleId,
    }),
    [fetchBundleDesc.FAILURE]: (state, action) => ({
      ...state,
      fetchError: action.payload.data,
    }),
    [fetchBundleDesc.FULFILL]: (state) => ({
      ...state,
      isFetchingDesc: false,
    }),
  },
  initialBundleState,
  (action) => action.payload.bundleId,
);

const nodeReducer = mapHandleActions(
  {
    [fetchBundlePublication.TRIGGER]: (state) => ({
      ...state,
      fetchError: null,
    }),
    [fetchBundlePublication.REQUEST]: (state) => ({
      ...state,
      isFetching: true,
    }),
    [fetchBundlePublication.SUCCESS]: (state, action) => ({
      ...state,
      data: action.payload.publicationId,
    }),
    [fetchBundlePublication.FAILURE]: (state, action) => ({
      ...state,
      fetchError: action.payload.data,
    }),
    [fetchBundlePublication.FULFILL]: (state) => ({
      ...state,
      isFetching: false,
    }),
  },
  initialNodeState,
  (action) => action.payload.nodeId,
);

export default combineReducers({
  desc: bundleDescReducer,
  nodes: nodeReducer,
});
