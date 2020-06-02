import request from '@/utils/request';

export const fetchSubscriptions = () =>
  request({
    url: '/api/subscription/user-subscription/',
    method: 'GET',
  });

export const subscribe = (data) =>
  request({
    url: '/api/subscription/user-subscription/',
    method: 'POST',
    data,
  });

export const unsubscribe = (data) =>
  request({
    url: '/api/subscription/user-subscription/unsubscribe/',
    method: 'POST',
    data,
  });

export const fetchSubscribedEvent = (params) =>
  request({
    url: '/api/subscription/user-subscribed-content/file-x/',
    method: 'GET',
    params,
  });

export const fetchSubscribedDimzou = (params) =>
  request({
    url: '/api/subscription/user-subscribed-content/dimzou/',
    method: 'GET',
    params,
  });
