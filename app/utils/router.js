import Router from 'next/router';
import getConfig from 'next/config';
import { parse } from 'path-to-regexp';
import { stringify } from 'query-string';

// url without query
export const asPathname = (asPath) => asPath.replace(/\?.*$/, '');

export const getAsPath = (pattern, query, omit = []) => {
  const tokens = parse(pattern);
  const mappedQuery = { ...query };
  const mapped = tokens.map((item) => {
    if (item instanceof Object) {
      if ((item.modifier === '?' && mappedQuery[item.name]) || !item.modifier) {
        delete mappedQuery[item.name];
        return `/${query[item.name]}`;
      }
      if (item.modifier === '?') {
        return '';
      }
    }
    return item;
  });
  omit.forEach((key) => delete mappedQuery[key]);
  const queryString = stringify(mappedQuery);
  if (queryString) {
    return `${mapped.join('')}?${queryString}`;
  }
  return mapped.join('');
};

const cleanUp = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (!obj[key]) {
      // eslint-disable-next-line no-param-reassign
      delete obj[key];
    }
  });
  return obj;
};

/**
 *
 * @param {object} newQuery
 * @param {boolean} replace
 * @param {string} customPattern 格式 `/profile/:userId`, 与  next.js 内部的 /profile/[userId] 有区别
 */
export const updateQuery = (newQuery, replace = false, customPattern = '') => {
  const query = cleanUp({
    ...Router.query,
    ...newQuery,
  });
  const href = {
    pathname: Router.pathname,
    query,
  };
  const asPath = customPattern
    ? getAsPath(customPattern, href.query)
    : undefined;

  if (replace) {
    Router.replace(href, asPath);
  } else {
    Router.push(href, asPath);
  }
};

export const getAppName = () => {
  const { publicRuntimeConfig } = getConfig();
  return publicRuntimeConfig.appName;
};

export const concatHeaders = (compos, delimiter = ' | ') => {
  let els;
  if (!compos) {
    els = [];
  } else if (typeof compos === 'string') {
    els = [compos];
  } else {
    els = compos;
  }
  const items = [...els, getAppName()].filter((a) => !!a);
  return items.join(delimiter);
};
