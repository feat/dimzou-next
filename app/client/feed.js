import request from '@/utils/request';

export const fetchFeedCategories = (params) =>
  request({
    url: '/api/feed/categories/',
    method: 'GET',
    params,
  });

export const fetchCategoryFeedItems = (id, params) =>
  request({
    url: `/api/feed/items/${id}/`,
    method: 'GET',
    params,
  });
