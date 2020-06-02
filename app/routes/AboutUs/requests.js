import request from '@/utils/request';

export const fetchInfo = (userId) =>
  request({
    url: `/api/user/user-info/${userId}/`,
    method: 'GET',
  })
    .then(({ data }) => data)
    .catch(() => undefined);

export const fethGroupInfo = (groupId) =>
  request({
    url: `/api/party/group/${groupId}/`,
    method: 'GET',
  })
    .then(({ data }) => data)
    .catch(() => undefined);

export const fetchPost = (slug) =>
  request({
    url: `/api/ui-translation/terms/${slug}`,
    method: 'GET',
  })
    .then(({ data }) => data)
    .catch(() => undefined);
export const fetchFeatMenu = () =>
  request({
    url: '/api/menu/feat',
    method: 'GET',
  });
