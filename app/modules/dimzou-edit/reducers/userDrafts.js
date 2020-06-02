import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import uniq from 'lodash/uniq';
import { 
  fetchUserDrafts,
  loadBundleEditInfo,
  fetchBundleDesc,
  resetBundle,
  deleteBundle,
} from '../actions';
export const initialUserDraftsState = {
  onceFetched: false,
  data: undefined, // id array
  next: null,
  error: null,
  loading: false,
  loaded: [], // id array
  ids: {},
} 

const getIds = (array) => {
  const map = {};
  array.forEach((item) => {
    map[item.id] = true
    if (item.all_copies) {
      item.all_copies.forEach((b) => {
        map[b.id] = true;
      })
    }
  });
  return map;
}

function cleanupBundle(state, bundleId) {
  return update(state, {
    data: (list) => {
      if (!list) {
        return  list;
      }
      return list.filter((id) => id !== bundleId);
    },
    loaded: (list) => list.filter((id) => id !== bundleId),
    ids: (map) => {
      if (map[bundleId]) {
        const updated = {...map};
        delete updated[bundleId]
        return updated;
      }
      return map;
    },
  })
}

export default handleActions({
  [fetchUserDrafts.TRIGGER]: (state) => ({
    ...state,
    onceFetched: true,
    error: null,
  }),
  [fetchUserDrafts.REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [fetchUserDrafts.SUCCESS]: (state, action) => update(state, {
    data: (list = []) => {
      if (action.payload.refresh) {
        return uniq([
          ...action.payload.data,
          ...list,
        ])
      }
      return uniq([
        ...list,
        ...action.payload.data,
      ])
    },
    ids: (map) => ({
      ...map,
      ...getIds(action.payload.raw),
    }),
    next: (stateNext) => {
      if (!stateNext) {
        return action.payload.next;
      }
      if (stateNext && action.payload.refresh) {
        return stateNext;
      } 
      return action.payload.next;
    },
  }),
  [fetchUserDrafts.FAILURE]: (state, action) => ({
    ...state,
    error: action.payload.data,
  }),
  [fetchUserDrafts.FULFILL]: (state) => ({
    ...state,
    loading: false,
  }),
  [loadBundleEditInfo]: (state, action) => ({
    ...state,
    loaded: uniq([
      action.payload.data.id,
      ...state.loaded,
    ]),
  }),
  [fetchBundleDesc.SUCCESS]: (state, action) => ({
    ...state, 
    loaded: uniq([
      action.payload.bundleId,
      ...state.loaded,
    ]),
  }),
  [resetBundle]: (state, action) => cleanupBundle(state, action.payload.bundleId),
  [deleteBundle.SUCCESS]: (state, action) => cleanupBundle(state, action.payload.bundleId),
}, initialUserDraftsState)