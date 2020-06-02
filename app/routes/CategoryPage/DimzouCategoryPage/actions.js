import { createRoutine } from 'redux-saga-routines';

import { fetchCategoryFeedItems as fetchCategoryFeedsRequest } from '@/client/feed';

import configTemplates from '@/components/FeedTemplate/configTemplates';

import { selectPageContent } from './selectors';

const NS = 'CAT/DIMZOU';
const TYPE = 'publication,node';

export const fetchCategoryFeeds = createRoutine(
  `${NS}/FETCH_CATEGORY_FEEDS`
);

export const asyncFetchCategoryFeeds = (payload) => async (dispatch, getState) => {
  const {
    data = { page: 1, page_size: 16, type: TYPE },
    categoryId,
  } = payload
  dispatch(fetchCategoryFeeds.trigger(payload))
  try {
    dispatch(fetchCategoryFeeds.request({ categoryId }));
    const { data: resData, pagination } = await fetchCategoryFeedsRequest(
      categoryId,
      {
        ...data,
        type: TYPE,
      },
    );
    const contentState = selectPageContent(getState(), { categoryId })
    const templates = configTemplates(
      contentState.templates,
      resData.length,
      pagination.total_count,
    );
    dispatch(
      fetchCategoryFeeds.success({
        categoryId,
        data: {
          items: resData,
          templates,
          next: pagination.next
            ? {
              page: pagination.next,
              page_size: pagination.page_size,
            }
            : null,
          hasMore: pagination.total_pages > data.page,
        },
      }),
    );
  } catch (err) {
    dispatch(
      fetchCategoryFeeds.failure({
        categoryId,
        data: err,
      }),
    );
    throw err;
  } finally {
    dispatch(
      fetchCategoryFeeds.fulfill({
        categoryId,
      }),
    );
  }
}