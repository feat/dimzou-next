import uniq from 'lodash/uniq';
import update from 'immutability-helper';
import { combineActions } from 'redux-actions';
import { mapHandleActions } from '@/utils/reducerCreators';
import {
  fetchUserRelated,
  loadBundleEditInfo,
  separateChapterPatch,
  newBundlePatch,
  resetBundle,
  deleteBundle,
  workshopUpdateFilter,
} from '../actions';

const initialState = {
  onceFetched: false,
  filter: '',
  data: undefined,
  next: null,
  error: null,
  loading: false,
  ids: {},
  loaded: [],
};

const getIds = (array) => {
  const map = {};
  array.forEach((item) => {
    map[item.id] = true;
    if (item.all_copies) {
      item.all_copies.forEach((b) => {
        map[b.id] = true;
      });
    }
  });
  return map;
};

function cleanupBundle(state, bundleId) {
  return update(state, {
    data: (list) => {
      if (!list) {
        return list;
      }
      return list.filter((id) => id !== bundleId);
    },
    loaded: (list) => list.filter((id) => id !== bundleId),
    ids: (map) => {
      if (map[bundleId]) {
        const updated = { ...map };
        delete updated[bundleId];
        return updated;
      }
      return map;
    },
  });
}

// TODO: may handle refresh

export default mapHandleActions(
  {
    [fetchUserRelated.TRIGGER]: (state) => ({
      ...state,
      onceFetched: true,
      error: null,
    }),
    [fetchUserRelated.REQUEST]: (state) => ({
      ...state,
      loading: true,
    }),
    [fetchUserRelated.SUCCESS]: (state, action) => {
      const newState = {
        ...state,
        data: uniq([...(state.data || []), ...action.payload.data]),
        ids: {
          ...state.ids,
          ...getIds(action.payload.raw),
        },
        next: action.payload.next,
      };
      return newState;
    },
    [fetchUserRelated.FAILURE]: (state, action) => ({
      ...state,
      error: action.payload.data,
    }),
    [fetchUserRelated.FULFILL]: (state) => ({
      ...state,
      loading: false,
    }),
    [loadBundleEditInfo]: (state, action) => ({
      ...state,
      loaded: uniq([...state.loaded, action.payload.bundleId]),
    }),
    [combineActions(separateChapterPatch, newBundlePatch)]: (state, action) => {
      if (!state.onceFetched) {
        return undefined;
      }
      return update(state, {
        loaded: (list) => uniq([...list, action.payload.bundleId]),
        data: (list = []) => uniq([action.payload.bundleId, ...list]),
        ids: (map) => ({
          ...map,
          [action.payload.bundleId]: true,
        }),
      });
    },
    [combineActions(resetBundle, deleteBundle.SUCCESS)]: (state, action) =>
      cleanupBundle(state, action.payload.bundleId),
    [workshopUpdateFilter]: (state, action) => ({
      ...state,
      filter: action.payload.filter,
    }),
  },
  initialState,
  (action) => action.payload.userId,
);
