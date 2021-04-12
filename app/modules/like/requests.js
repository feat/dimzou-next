import request from '@/utils/request';

export const like = (data) =>
  request({
    url: '/api/activity/like/',
    method: 'POST',
    data: {
      ...data,
      action: 'like',
    },
  });

export const unlike = (data) =>
  request({
    url: `/api/activity/like/`,
    method: 'POST',
    data: {
      ...data,
      action: 'unlike',
    },
  });

export const getLikes = (params) =>
  request({
    url: '/api/activity/like/',
    method: 'GET',
    params,
  });
