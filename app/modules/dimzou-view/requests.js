import request from '@/utils/request';

export const fetchUserDimzous = (userId, params) =>
  request({
    url: `/api/user/${userId}/dimzou/`,
    method: 'GET',
    params,
  });

export function fetchPublication(params, headers = {}) {
  return request({
    url: `/api/dimzou/publication/`,
    method: 'GET',
    params,
    headers,
  });
}

export function createCopyBundle(bundleId) {
  return request({
    url: `/api/dimzou/bundle/${bundleId}/create-copy/`,
    method: 'POST',
  })
}

export function createTranslationBundle(payload) {
  return request({
    url: '/api/dimzou/bundle/',
    method: 'POST',
    data: {
      type: 2, // translation,
      payload,
    },
  });
}