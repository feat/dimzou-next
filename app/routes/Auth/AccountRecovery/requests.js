import request from '@/utils/request';

export const getSecurityHint = (data) =>
  request({
    url: '/api/user/user-security-question/hint/',
    method: 'POST',
    data,
  });

export const verifySecurityInfo = (data) =>
  request({
    url: '/api/user/user-security-question/verify/',
    method: 'POST',
    data,
  });

export const changePassword = (data) =>
  request({
    url: '/api/auth/password/reset/',
    method: 'POST',
    data,
  });

export const sendResetCode = (data) =>
  request({
    url: '/api/auth/phone/reset/vcode/',
    method: 'POST',
    data,
  });

export const resetLoginAccount = (data) =>
  request({
    url: '/api/auth/phone/reset/',
    method: 'POST',
    data,
  });
