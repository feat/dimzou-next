import { createRoutine } from 'redux-saga-routines';
import request from '@/utils/request';

import {
  getRandomTemplate,
  getTemplateByCount,
} from '@/components/FeedTemplate/configTemplates';

import {
  fetchMostReadList as fetchMostReadListRequest,
  fetchMostCommentedList as fetchMostCommentedListRequest,
  fetchMostModifiedList as fetchMostModifiedListRequest,
  fetchMostTrackList as fetchMostTrackListRequest,
} from './requests';

// import {
//   selectIsFetchingCategories,
//   selectIsFetchingSection,
// } from './selectors';

const NS = 'DIMZOU_INDEX';
const FEED_TYPE = 'publication';

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

export const asyncFetchCategories = () => async (dispatch) => {
  dispatch(fetchCategories.request());
  try {
    const res = await request({
      url: '/api/feed/categories/',
      method: 'GET',
      params: {
        type: FEED_TYPE,
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
  let template = getRandomTemplate(0, maxItemCount);
  dispatch(fetchCategoryFeed.trigger(payload));
  try {
    dispatch(
      fetchCategoryFeed.request({
        categoryId,
        data: { template: template.displayName },
      }),
    );
    const res = await request({
      url: `/api/feed/items/${categoryId}/`,
      method: 'GET',
      params: {
        type: FEED_TYPE,
        page_size: template.maxItemCount,
      },
    });
    if (!res.data.length) {
      template = {};
    } else if (res.data.length < template.maxItemCount) {
      template = getTemplateByCount(res.data.length, true);
    }
    dispatch(
      fetchCategoryFeed.success({
        categoryId,
        data: {
          items: res.data,
          template: template.displayName,
        },
      }),
    );
  } catch (err) {
    dispatch(fetchCategoryFeed.failure({ categoryId, data: err }));
    throw err;
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
