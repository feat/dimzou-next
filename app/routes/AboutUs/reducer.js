import { handleActions } from 'redux-actions';
import { fetchData } from './actions';

export const REDUCER_KEY = 'aboutUs';

const initialState = {
  onceFetch: false,
  loading: false,
  fetchError: null,
  term: undefined,
  info: undefined,
  groupMembers: undefined,
};

const reducer = handleActions(
  {
    [fetchData.TRIGGER]: (state) => ({
      ...state,
      fetchError: null,
      onceFetch: true,
    }),
    [fetchData.REQUEST]: (state) => ({
      ...state,
      loading: true,
    }),
    [fetchData.SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [fetchData.FAILURE]: (state, action) => ({
      ...state,
      fetchError: action.payload,
    }),
    [fetchData.FULFILL]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  initialState,
);

export default reducer;
