import request from '@/utils/request';

export const getVerificationCode = (data) =>
  request({
    url: '/api/auth/phone/code',
    method: 'POST',
    data,
  });

export const verifyCode = (data) =>
  request({
    url: '/api/auth/phone/',
    method: 'POST',
    data,
  });

export const register = (data) =>
  request({
    url: '/api/auth/register',
    method: 'POST',
    data,
  });
