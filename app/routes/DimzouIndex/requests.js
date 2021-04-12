import request from '@/utils/request';

const FEED_TYPE = 'publication';

export const fetchCategories = () =>
  request({
    url: '/api/feed/categories/',
    method: 'GET',
    params: {
      type: FEED_TYPE,
    },
  });

export const fetchCategoryFeed = (categoryId, params = { page_size: 7 }) =>
  request({
    url: `/api/feed/items/${categoryId}/`,
    method: 'GET',
    params: {
      type: FEED_TYPE,
      ...params,
    },
  });

export const fetchMostReadList = (params) =>
  request({
    url: `/api/dimzou/feed/most-read/`,
    method: 'GET',
    params,
  });

export const fetchMostCommentedList = (params) =>
  request({
    url: '/api/dimzou/feed/most-commented/',
    method: 'GET',
    params,
  });

export const fetchMostModifiedList = (params) =>
  request({
    url: '/api/dimzou/feed/most-modified/',
    method: 'GET',
    params,
  });

export const fetchMostTrackList = (params) =>
  request({
    url: '/api/dimzou/feed/most-track/',
    method: 'GET',
    params,
  });

export const getDimzouExtraInfo = (params) =>
  request({
    url: '/api/dimzou/bundle/extra-info/',
    method: 'GET',
    params,
  });
