import { createRoutine } from 'redux-saga-routines';
import { createAction } from 'redux-actions';

import { provider } from './helpers';

import {
  // fetchCategories as fetchCategoriesRequest,
  fetchCategoryFeed as fetchCategoryFeedRequest,
  fetchMostReadList as fetchMostReadListRequest,
  fetchMostCommentedList as fetchMostCommentedListRequest,
  fetchMostModifiedList as fetchMostModifiedListRequest,
  fetchMostTrackList as fetchMostTrackListRequest,
  getDimzouExtraInfo as getDimzouExtraInfoRequest,
} from './requests';

// import {
//   selectIsFetchingCategories,
//   selectIsFetchingSection,
// } from './selectors';

const NS = 'DIMZOU_INDEX';

export const fetchCategories = createRoutine(`${NS}/FETCH_CATEGORIES`);
export const fetchCategoryFeed = createRoutine(`${NS}/FETCH_CATEGORY_FEED`);

export const fetchMostReadList = createRoutine(`${NS}/FETCH_MOST_READ_LIST`);
export const fetchMostCommentedList = createRoutine(
  `${NS}/FETCH_MOST_COMMENTED_LIST`,
);
export const fetchMostModifiedList = createRoutine(
  `${NS}/FETCH_MOST_MODIFIED_LIST`,
);
export const fetchMostTrackList = createRoutine(`${NS}/FETCH_MOST_TRACK_LIST`);

export const fetchTopScoredList = createRoutine(`${NS}/FETCH_TOP_SCORED_LIST`);
export const updateCategoryFilter = createAction(
  `${NS}/UPDATE_CATEGORY_FILTER`,
);
export const setSectionTemplates = createAction(`${NS}/SET_SECTION_TEMPLATES`);

export const asyncFetchCategories = () => async (
  dispatch,
  getState,
  { request },
) => {
  dispatch(fetchCategories.request());
  try {
    const res = await request({
      url: '/api/feed/categories/',
      method: 'GET',
      params: {
        type: 'publication',
      },
    });
    dispatch(fetchCategories.success(res.data));
  } catch (err) {
    dispatch(fetchCategories.failure(err));
    throw err;
  } finally {
    dispatch(fetchCategories.fulfill());
  }
};

export const asyncFetchCategoryFeed = (payload) => async (dispatch) => {
  const { categoryId, maxItemCount } = payload;
  // const isLoading = selectIsFetchingSection(getState(), categoryId)
  // if (isLoading) {
  //   // return
  // }

  // 1. get count based on maxItemCount
  const count = maxItemCount ? Math.min(7, maxItemCount) : 7;
  // 2. get template array and store templates
  let templates = payload.templates || provider.getTemplates(count);
  dispatch(fetchCategoryFeed.trigger(payload));
  try {
    dispatch(
      fetchCategoryFeed.request({
        categoryId,
        templates,
      }),
    );
    const { data } = await fetchCategoryFeedRequest(categoryId, {
      page_size: count,
    });
    if (!data.length) {
      templates = null;
    } else if (data.length < count) {
      templates = provider.getTemplates(data.length);
    }
    if (data.length) {
      const { data: extraInfo } = await getDimzouExtraInfoRequest({
        ids: data.map((item) => item.bundle_id),
        types: ['cards'],
      });
      const extraInfoMap = {};
      extraInfo.forEach((info) => {
        extraInfoMap[info.bundle] = info.data;
      });
      data.forEach((item) => {
        if (extraInfoMap[item.bundle_id]) {
          // eslint-disable-next-line no-param-reassign
          item.cardsInfo = extraInfoMap[item.bundle_id];
        }
      });
    }
    dispatch(
      fetchCategoryFeed.success({
        categoryId,
        data,
        templates,
      }),
    );
  } catch (err) {
    dispatch(fetchCategoryFeed.failure({ categoryId, data: err }));
  } finally {
    dispatch(fetchCategoryFeed.fulfill({ categoryId }));
  }
};

export const asyncFetchMostReadList = () => async (dispatch) => {
  dispatch(fetchMostReadList.request());
  try {
    const { data } = await fetchMostReadListRequest({ page_size: 9 });
    dispatch(fetchMostReadList.success(data));
  } catch (err) {
    dispatch(fetchMostReadList.failure(err));
    throw err;
  } finally {
    dispatch(fetchMostReadList.fulfill());
  }
};

export const asyncFetchMostCommentedList = () => async (dispatch) => {
  dispatch(fetchMostCommentedList.request());
  try {
    const { data } = await fetchMostCommentedListRequest({
      page_size: 9,
    });
    dispatch(fetchMostCommentedList.success(data));
  } catch (err) {
    dispatch(fetchMostCommentedList.failure(err));
    throw err;
  } finally {
    dispatch(fetchMostCommentedList.fulfill());
  }
};

export const asyncFetchMostModifiedList = () => async (dispatch) => {
  dispatch(fetchMostModifiedList.request());
  try {
    const { data } = await fetchMostModifiedListRequest({ page_size: 9 });
    dispatch(fetchMostModifiedList.success(data));
  } catch (err) {
    dispatch(fetchMostModifiedList.failure(err));
    throw err;
  } finally {
    dispatch(fetchMostModifiedList.fulfill());
  }
};

export const asyncFetchMostTrackList = () => async (dispatch) => {
  dispatch(fetchMostTrackList.request());
  try {
    const { data } = await fetchMostTrackListRequest({ page_size: 9 });
    dispatch(fetchMostTrackList.success(data));
  } catch (err) {
    dispatch(fetchMostTrackList.failure(err));
    throw err;
  } finally {
    dispatch(fetchMostTrackList.fulfill());
  }
};
