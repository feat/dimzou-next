import request from '@/utils/request';

export const registerWithEmail = ({ username, password1, password2, email }) =>
  request({
    url: '/api/auth/registration/',
    method: 'POST',
    data: {
      username,
      password1,
      password2,
      email,
    },
  });

export const getPhoneVerificationCode = (data) =>
  request({
    url: '/api/auth/registration/phone-verification/',
    method: 'POST',
    data,
  });

export const registerWithPhone = ({ vcode, phone, password, country_code }) =>
  request({
    url: '/api/auth/registration/phone-register/',
    method: 'POST',
    data: {
      vcode,
      phone,
      password,
      country_code,
    },
  });

export const authWithUsernameAndPassword = (data) => {
  const { username, password } = data;
  return request({
    url: '/api/auth/login/',
    method: 'POST',
    data: {
      username,
      password,
    },
  });
};

export const authWithPhoneAndPassword = (data) => {
  const { phone, password, fingerprint } = data;
  return request({
    url: '/api/auth/login/',
    method: 'POST',
    headers: {
      fingerprint,
      'Content-Type': 'application/json',
    },
    data: {
      username: phone,
      password,
    },
  });
};

export const logout = () =>
  request({
    url: '/api/auth/logout/',
    method: 'POST',
  });

export const requestPasswordResetEmail = (data) => {
  const { email } = data;
  return request({
    url: '/api/auth/password/reset/',
    method: 'POST',
    data: {
      email,
    },
  });
};

export const resetPassword = (data) => {
  const { token, new_password1, new_password2, uid } = data;
  return request({
    url: '/api/auth/password/reset/confirm/',
    method: 'POST',
    data: {
      token,
      new_password1,
      new_password2,
      uid,
    },
  });
};

export const resetPasswordWithPhone = (data) => {
  const { country_code, phone, password, vcode } = data;
  return request({
    url: '/api/auth/registration/phone-reset-password/',
    method: 'POST',
    data: {
      country_code,
      phone,
      password,
      vcode,
    },
  });
};

export const changePassword = (data) => {
  const { old_password, new_password1, new_password2 } = data;
  return request({
    url: '/api/auth/password/change/',
    method: 'POST',
    data: {
      old_password,
      new_password1,
      new_password2,
    },
  });
};

export const queryExists = (data) => {
  const { username, email } = data;
  return request({
    url: '/api/auth/query_exists/',
    method: 'POST',
    data: {
      username,
      email,
    },
  });
};
