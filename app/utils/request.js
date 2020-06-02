import axios from 'axios';
import get from 'lodash/get';
import Cookie from 'js-cookie';

import ApiError from '@/errors/ApiError';

const baseHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// eslint-disable-next-line no-nested-ternary
export const baseURL = typeof window === 'undefined'
  ? process.env.API_ENDPOINT
  : get(global.Project, 'baseURL', '')

export const instance = axios.create({
  baseURL,
  headers: baseHeaders,
});

export const setLanguageLocale = (locale) => {
  if (locale) {
    instance.defaults.headers.common['X-Language-Locale'] = locale;
  } else {
    delete instance.defaults.headers.common['X-Language-Locale'];
  }
};

export const setCsrfToken = () => {
  const csrftoken = Cookie.get('csrftoken');
  if (csrftoken) {
    instance.defaults.headers.common['X-CSRFToken'] = csrftoken;
  }
};

if (process.browser) {
  // based on cookie
  // setLanguageLocale('zh-CN')
  setCsrfToken();
}

export const setAuthHeader = (header) => {
  instance.defaults.headers.common.Authorization = header;
};

export const getAuthHeader = () =>
  instance.defaults.headers.common.Authorization;

if (process.browser) {
  window.addEventListener('SocketConnected', (e) => {
    instance.defaults.headers.common['X-Socket-ID'] = e.detail.sid;
  });

  window.addEventListener('ResetToken', () => {
    delete instance.defaults.headers.common.Authorization;
  });

  window.addEventListener('SetToken', (e) => {
    instance.defaults.headers.common.Authorization = `Token ${e.detail.token}`;
  });
}

export default function request(config) {
  const { headers, ...rest } = config;
  if (headers) {
    rest.headers = {
      ...instance.defaults.headers.common,
      ...headers,
    }
  }
  
  return instance
    .request(rest)
    .then((res) => res.data)
    .catch((error) => {
      if (error.response && error.response.data instanceof Object) {
        throw new ApiError(error.response.data);
      }
      throw error;
    });
}
