import request from '@/utils/request';
export const fetchUserDimzous = (userId, params) =>
  request({
    url: `/api/user/${userId}/dimzou/`,
    method: 'GET',
    params,
  });
