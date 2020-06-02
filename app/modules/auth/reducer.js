import { handleActions } from 'redux-actions';

import {
  setCurrentUser,
  openAuthModal,
  closeAuthModal,
  authRequired,
} from './actions';

const initialState = {
  token: undefined,
  user: undefined,
  userMeta: null,
};

export default handleActions(
  {
    [setCurrentUser]: (state, action) => ({
      ...state,
      user: action.payload.user,
      userMeta: action.payload.meta,
    }),
    [openAuthModal]: (state, action) => ({
      ...state,
      isAuthModalOpened: true,
      next: action.payload.nextAction,
    }),
    [authRequired]: (state, action) => ({
      ...state,
      next: action.payload,
    }),
    [closeAuthModal]: (state) => ({
      ...state,
      isAuthModalOpened: false,
    }),
  },
  initialState,
);

export const REDUCER_KEY = 'auth';
