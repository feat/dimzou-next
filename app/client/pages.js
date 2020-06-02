import request from '@/utils/request';

export const getHomePageData = () =>
  request({
    url: '/api/search/index/',
  });

export const getAwesomePageData = () =>
  request({
    url: '/api/search/awesome/',
  });
