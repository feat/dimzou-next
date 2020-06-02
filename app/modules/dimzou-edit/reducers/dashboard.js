import { handleActions } from 'redux-actions';
import update from 'immutability-helper';

import {
  fetchDimzouReports,
  fetchReaderReport,
  fetchReaderTaste,
  deleteBundle,
  fetchReaderCommented,
} from '../actions';

export const initialState = {
  dimzouReports: {
    loading: false,
    onceFetched: false,
    list: [],
    next: undefined,
    hasMore: true,
    fetchError: null,
  },
  readerReport: {
    loading: false,
    onceFetched: false,
    data: null,
    fetchError: null,
  },
  commented: {
    data: [],
    onceFetched: false,
    fetchError: null,
    loading: false,
  },
  readerTaste: {
    loading: false,
    onceFetched: false,
    list: [],
    templates: [],
    next: undefined,
    hasMore: true,
    fetchError: null,
  },
};

const reducer = handleActions(
  {
    [fetchDimzouReports]: (state) =>
      update(state, {
        dimzouReports: (subState) => ({
          ...subState,
          onceFetched: true,
          fetchError: null,
        }),
      }),
    [fetchDimzouReports.REQUEST]: (state) =>
      update(state, {
        dimzouReports: (subState) => ({
          ...subState,
          loading: true,
        }),
      }),
    [fetchDimzouReports.SUCCESS]: (state, action) =>
      update(state, {
        dimzouReports: (subState) => ({
          ...subState,
          list: [...subState.list, ...action.payload.list],
          next: action.payload.next,
          hasMore: action.payload.hasMore,
        }),
      }),
    [fetchDimzouReports.FAILURE]: (state, action) =>
      update(state, {
        dimzouReports: (subState) => ({
          ...subState,
          fetchError: action.payload,
        }),
      }),
    [fetchDimzouReports.FULFILL]: (state) =>
      update(state, {
        dimzouReports: (subState) => ({
          ...subState,
          loading: false,
        }),
      }),

    [fetchReaderReport]: (state) =>
      update(state, {
        readerReport: (subState) => ({
          ...subState,
          onceFetched: true,
          fetchError: null,
        }),
      }),
    [fetchReaderReport.REQUEST]: (state) =>
      update(state, {
        readerReport: (subState) => ({
          ...subState,
          loading: true,
        }),
      }),
    [fetchReaderReport.SUCCESS]: (state, action) =>
      update(state, {
        readerReport: (subState) => ({
          ...subState,
          data: action.payload,
        }),
      }),
    [fetchReaderReport.FAILURE]: (state, action) =>
      update(state, {
        readerReport: (subState) => ({
          ...subState,
          fetchError: action.payload,
        }),
      }),
    [fetchReaderReport.FULFILL]: (state) =>
      update(state, {
        readerReport: (subState) => ({
          ...subState,
          loading: false,
        }),
      }),

    [fetchReaderTaste]: (state) =>
      update(state, {
        readerTaste: (subState) => ({
          ...subState,
          onceFetched: true,
          fetchError: null,
        }),
      }),
    [fetchReaderTaste.REQUEST]: (state) =>
      update(state, {
        readerTaste: (subState) => ({
          ...subState,
          loading: true,
        }),
      }),
    [fetchReaderTaste.SUCCESS]: (state, action) =>
      update(state, {
        readerTaste: (subState) => ({
          ...subState,
          list: [...subState.list, ...action.payload.list],
          templates: action.payload.templates,
          next: action.payload.next,
          hasMore: action.payload.hasMore,
        }),
      }),
    [fetchReaderTaste.FAILURE]: (state, action) =>
      update(state, {
        readerTaste: (subState) => ({
          ...subState,
          fetchError: action.payload,
        }),
      }),
    [fetchReaderTaste.FULFILL]: (state) =>
      update(state, {
        readerTaste: (subState) => ({
          ...subState,
          loading: false,
        }),
      }),

    [deleteBundle.SUCCESS]: (state, action) =>
      update(state, {
        dimzouReports: {
          list: (list) =>
            list.filter((item) => item !== action.payload.bundleId),
        },
        readerTaste: {
          list: (list) =>
            list.filter((item) => item !== action.payload.bundleId),
        },
      }),

    [fetchReaderCommented.TRIGGER]: (state) =>
      update(state, {
        commented: (subState) => ({
          ...subState,
          onceFetched: true,
          fetchError: null,
        }),
      }),

    [fetchReaderCommented.REQUEST]: (state) =>
      update(state, {
        commented: (subState) => ({
          ...subState,
          loading: true,
        }),
      }),

    [fetchReaderCommented.SUCCESS]: (state, action) =>
      update(state, {
        commented: (subState) => ({
          ...subState,
          data: action.payload.data,
        }),
      }),

    [fetchReaderCommented.FAILURE]: (state, action) =>
      update(state, {
        commented: (subState) => ({
          ...subState,
          fetchError: action.payload,
        }),
      }),
    [fetchReaderCommented.FULFILL]: (state) =>
      update(state, {
        commented: (subState) => ({
          ...subState,
          loading: false,
        }),
      }),
  },
  initialState,
);

export default reducer;

