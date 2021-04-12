import axios from 'axios';
import getConfig from 'next/config';

import ApiError from '@/errors/ApiError';

const LOCALE_HEADER = 'X-Language-Locale';
const SOCKET_ID_HEADER = 'X-Socket-ID';

function getBaseURL() {
  if (typeof window === 'object') {
    try {
      const { publicRuntimeConfig } = getConfig();
      return publicRuntimeConfig.apiEndpoint || '';
    } catch (err) {
      return '';
    }
  }
  if (process.env.NODE_ENV === 'test') {
    return '';
  }
  return process.env.API_ENDPOINT;
}
export const baseURL = getBaseURL();

/**
 *
 * @param {*} options { headers, locale }
 */
export function createInstance(options = {}) {
  const instance = axios.create({
    baseURL,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
  });

  if (options.locale) {
    instance.defaults.headers.common[LOCALE_HEADER] = options.locale;
  }

  if (typeof window === 'object') {
    window.addEventListener('SocketConnected', (e) => {
      instance.defaults.headers.common[SOCKET_ID_HEADER] = e.detail.sid;
    });

    window.addEventListener('SetLanguageLocale', (e) => {
      const { locale } = e.detail;
      if (locale) {
        instance.defaults.headers.common[LOCALE_HEADER] = locale;
      } else {
        delete instance.defaults.headers.common[LOCALE_HEADER];
      }
    });
    // fake ip config;
  }

  instance.interceptors.request.use((config) => {
    if (config.locale === false) {
      // eslint-disable-next-line no-param-reassign
      delete config.headers[LOCALE_HEADER];
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res.data,
    (error) => {
      if (error.response && error.response.data instanceof Object) {
        return Promise.reject(new ApiError(error.response.data));
      }
      // eslint-disable-next-line no-param-reassign
      error.toJSON = function toJSON() {
        return { message: this.message };
      };
      return Promise.reject(error);
    },
  );

  return instance;
}

const request = createInstance();

export default request;

export const { CancelToken, isCancel } = axios;

// export default function request(config) {
//   const { headers, ...rest } = config;
//   if (headers) {
//     rest.headers = {
//       ...instance.defaults.headers.common,
//       ...headers,
//     };
//   }

//   return instance
//     .request(rest)
//     .then((res) => res.data)
//     .catch((error) => {
//       if (error.response && error.response.data instanceof Object) {
//         if (error.response.data.code) {
//           throw new ApiError(error.response.data);
//         } else {
//           // eslint-disable-next-line no-param-reassign
//           error.data = error.response.data.data;
//         }
//       }
//       throw error;
//     });
// }
