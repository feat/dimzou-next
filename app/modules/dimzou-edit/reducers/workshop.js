import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { mapHandleActions } from '@/utils/reducerCreators';

import {
  workshopNavInit,
  workshopNavReset,
  workshopNavForward,
  workshopNavBackward,
  workshopNavPin,
  workshopNavUnpin,
  workshopNavPush,
  setSidebarHasFocus,
} from '../actions';

const initNavigatorState = {
  prev: [],
  current: null,
  next: [],
  currentPinned: false,
};

const initDataState = {
  filter: '',
  expandedKeys: [],
  data: null,
  fetching: false,
  onceFetched: false,
  fetchError: null,
};

const navigator = handleActions(
  {
    [workshopNavInit]: (state, action) => {
      if (state.current) {
        return state;
      }
      return {
        ...state,
        current: action.payload.userId,
      };
    },
    [workshopNavReset]: (_, action) => ({
      ...initNavigatorState,
      current: action.payload.userId,
    }),
    [workshopNavPin]: (state) => ({
      ...state,
      currentPinned: true,
    }),
    [workshopNavUnpin]: (state) => ({
      ...state,
      currentPinned: false,
    }),
    [workshopNavBackward]: (state) => {
      if (!state.prev.length) {
        return state;
      }
      const prev = [...state.prev];
      const [current] = prev.splice(-1, 1);
      const next = [state.current, ...state.next];
      return {
        prev,
        current,
        next,
        currentPinned: false,
      };
    },
    [workshopNavForward]: (state) => {
      if (!state.next.length) {
        return state;
      }
      const [current, ...next] = state.next;
      const prev = [...state.prev, state.current];
      return {
        ...state,
        prev,
        current,
        next,
        currentPinned: false,
      };
    },
    [workshopNavPush]: (state, action) => {
      if (
        (state.currentPinned && !action.payload.force) ||
        // eslint-disable-next-line eqeqeq
        state.current == action.payload.userId
      ) {
        return state;
      }
      const prev = [...state.prev, state.current];
      return {
        prev,
        current: action.payload.userId,
        next: [],
        currentPinned: false,
      };
    },
  },
  initNavigatorState,
);

const ui = handleActions(
  {
    [setSidebarHasFocus]: (state, action) => ({
      ...state,
      hasFocus: action.payload,
    }),
  },
  {
    hasFocus: false,
  },
);

const data = mapHandleActions(
  {},
  initDataState,
  (action) => action.payload.userId,
);

export default combineReducers({
  navigator,
  ui,
  data,
});
