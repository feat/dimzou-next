import fetch from 'isomorphic-fetch';
import Cookie from 'js-cookie';
import { stringify } from 'query-string';
import statusHelper from './statusHelper';

const baseConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
};

export const setLanguageLocale = (locale) => {
  baseConfig.headers['X-Language-Locale'] = locale;
};

export default function request(config) {
  const { url, method = 'GET', params } = config;
  let endPoint = `${Project.apiBaseURL}${url}`;
  let body;
  const options = {
    credentials: config.credentials || baseConfig.credentials,
    headers: {
      ...baseConfig.headers,
      ...config.headers,
      'X-CSRFToken': Cookie.get('csrftoken'),
    },
  };

  endPoint = params ? `${endPoint}?${stringify(params)}` : endPoint;

  // GET request
  if (method.toLowerCase() === 'get' || method.toLowerCase() === 'head') {
    return fetch(endPoint, options).then(statusHelper);
  }

  options.method = method;

  // Other request
  if (options.headers['Content-Type'] === false) {
    delete options.headers['Content-Type'];
    body = config.data;
  } else if (options.headers['Content-Type'] === 'application/json') {
    body = JSON.stringify(config.data);
  } else {
    body = config.data;
  }
  options.body = body;
  return fetch(endPoint, options).then(statusHelper);
}
