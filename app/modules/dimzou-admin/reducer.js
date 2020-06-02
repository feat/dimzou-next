import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
// import { stringify } from 'qs'
import {
  fetchDimzouList,
} from './actions';

export const initialRequestState = {
  loading: false, 
  items: undefined,
  next: null,
  onceFetched: false,
}

export const REDUCER_KEY = 'dimzou-admin'

const reducer = handleActions({
  [fetchDimzouList.TRIGGER]: (state, action) => {
    const { payload } = action;
    return update(state, {
      [payload.type]: (subState = initialRequestState) => ({
        ...subState,
        fetchError: null,
        onceFetched: true,
      }),
    })
  },
  [fetchDimzouList.REQUEST]: (state, action) => {
    const { payload } = action;
    return update(state, {
      [payload.type]: (subState = initialRequestState) => ({
        ...subState,
        loading: true,
      }),
    })
  },
  [fetchDimzouList.SUCCESS]: (state, action) => {
    const { payload } = action;
    return update(state, {
      [payload.params.type]: (subState = initialRequestState) => ({
        ...subState,
        items: [...new Set([
          ...(subState.items || []),
          ...payload.data,
        ])],
        next: payload.pagination.next,
      }),
    })
  },
  [fetchDimzouList.FAILURE]: (state, action) => {
    const { payload } = action;
    return update(state, {
      [payload.params.type]: (subState = initialRequestState) => ({
        ...subState,
        fetchError: payload.data,
      }),
    })
  },
  [fetchDimzouList.FULFILL]: (state, action) => {
    const { payload } = action;
    return update(state, {
      [payload.type]: (subState = initialRequestState) => ({
        ...subState,
        loading: false,
      }),
    })
  },
}, {})

export default reducer;