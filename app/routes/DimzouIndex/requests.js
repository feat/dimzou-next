import request from '@/utils/request';

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
