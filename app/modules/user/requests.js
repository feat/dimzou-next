import request from '@/utils/request';

export const getUserInfo = (userId, params, headers) => request({
  url: `/api/user/user-info/${userId}/`,
  method: 'GET',
  params,
  headers,
});

export const getUserStatistics = (userId, params, headers) => request({
  url: `/api/user/${userId}/statistics/`,
  method: 'GET',
  params,
  headers,
})

export const getDimzouScore = (userId, params, headers) => request({
  url: `/api/dimzou/${userId}/dimzou-score/`,
  method: 'GET',
  params,
  headers,
})

export const getApplicationAvailableInfo = (userId, params, headers) => 
  request({
    url: `/api/user/user-application-available/`,
    params: { uid: userId },
    headers,
  })