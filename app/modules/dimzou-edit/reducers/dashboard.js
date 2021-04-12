import { stringify } from 'query-string';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import update from 'immutability-helper';

import {
  fetchDimzouReports,
  fetchReaderReport,
  fetchReaderTaste,
  deleteBundle,
  fetchReaderCommented,
  setResourceStatsQuery,
  fetchResourceStats,
} from '../actions';

const readerReport = handleActions(
  {
    [fetchReaderReport]: (state) => ({
      ...state,
      onceFetched: true,
      fetchError: null,
    }),
    [fetchReaderReport.REQUEST]: (state) => ({
      ...state,
      loading: true,
    }),
    [fetchReaderReport.SUCCESS]: (state, action) => ({
      ...state,
      data: action.payload,
    }),
    [fetchReaderReport.FAILURE]: (state, action) => ({
      ...state,
      fetchError: action.payload,
    }),
    [fetchReaderReport.FULFILL]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  {
    loading: false,
    onceFetched: false,
    data: null,
    fetchError: null,
  },
);

const commented = handleActions(
  {
    [fetchReaderCommented.TRIGGER]: (state) => ({
      ...state,
      onceFetched: true,
      fetchError: null,
    }),

    [fetchReaderCommented.REQUEST]: (state) => ({
      ...state,
      loading: true,
    }),

    [fetchReaderCommented.SUCCESS]: (state, action) => ({
      ...state,
      data: action.payload.data,
    }),

    [fetchReaderCommented.FAILURE]: (state, action) => ({
      ...state,
      fetchError: action.payload,
    }),
    [fetchReaderCommented.FULFILL]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  {
    data: [],
    onceFetched: false,
    fetchError: null,
    loading: false,
  },
);

const dimzouReports = handleActions(
  {
    [fetchDimzouReports]: (state) => ({
      ...state,
      onceFetched: true,
      fetchError: null,
    }),
    [fetchDimzouReports.REQUEST]: (state) => ({
      ...state,
      loading: true,
    }),
    [fetchDimzouReports.SUCCESS]: (state, action) => ({
      ...state,
      list: [...state.list, ...action.payload.list],
      next: action.payload.next,
      hasMore: action.payload.hasMore,
    }),
    [fetchDimzouReports.FAILURE]: (state, action) => ({
      ...state,
      fetchError: action.payload,
    }),
    [fetchDimzouReports.FULFILL]: (state) => ({
      ...state,
      loading: false,
    }),
    [deleteBundle.SUCCESS]: (state, action) => ({
      ...state,
      list: state.list.filter((item) => item !== action.payload.bundleId),
    }),
  },
  {
    loading: false,
    onceFetched: false,
    list: [],
    next: undefined,
    hasMore: true,
    fetchError: null,
  },
);

const readerTaste = handleActions(
  {
    [fetchReaderTaste]: (state) => ({
      ...state,
      onceFetched: true,
      fetchError: null,
    }),
    [fetchReaderTaste.REQUEST]: (state) => ({
      ...state,
      loading: true,
    }),
    [fetchReaderTaste.SUCCESS]: (state, action) => ({
      ...state,
      list: [...state.list, ...action.payload.list],
      templates: action.payload.templates,
      next: action.payload.next,
      hasMore: action.payload.hasMore,
    }),
    [fetchReaderTaste.FAILURE]: (state, action) => ({
      ...state,
      fetchError: action.payload,
    }),
    [fetchReaderTaste.FULFILL]: (state) => ({
      ...state,
      loading: false,
    }),
    [deleteBundle.SUCCESS]: (state, action) => ({
      ...state,
      list: state.list.filter((item) => item !== action.payload.bundleId),
    }),
  },
  {
    loading: false,
    onceFetched: false,
    list: [],
    templates: [],
    next: undefined,
    hasMore: true,
    fetchError: null,
  },
);

const resourceBriefReport = handleActions(
  {},
  {
    loading: false,
    onceFetched: false,
    fetchError: null,
    data: null, // breif
  },
);

const resourceStats = handleActions(
  {
    [setResourceStatsQuery]: (state, action) => ({
      ...state,
      query: action.payload,
    }),
    [fetchResourceStats.REQUEST]: (state) => ({
      ...state,
      loading: true,
    }),
    [fetchResourceStats.SUCCESS]: (state, action) =>
      update(state, {
        requests: {
          [stringify(action.payload.query)]: {
            $set: {
              data: action.payload.data,
              pagination: action.payload.pagination,
            },
          },
        },
      }),
    [fetchResourceStats.FULFILL]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  {
    query: {},
    loading: false,
    requests: {},
  },
);

export default combineReducers({
  readerReport,
  commented,
  dimzouReports,
  readerTaste,
  resourceBriefReport,
  resourceStats,
});
