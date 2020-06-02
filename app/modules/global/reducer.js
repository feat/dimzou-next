import { handleActions } from 'redux-actions';
import { appInitialFailure, appInitialSuccess } from './actions';

const initialState = {
  loading: true,
  isReady: false,
  error: null,
  fetchingChoices: false,
  choices: null,
};

const appReducer = handleActions(
  {
    [appInitialSuccess]: (state) => ({
      ...state,
      isReady: true,
      loading: false,
    }),
    [appInitialFailure]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
  },
  initialState,
);

export default appReducer;
