import request from '@/utils/request';

export const fetchMenu = (name) =>
  request({
    url: `/api/menu/${name}/`,
  });
