import { parse } from 'path-to-regexp'
import { stringify } from 'query-string';

export const asPathname = (asPath) => asPath.replace(/\?.*$/, '')

export const getAsPath = (pattern, query) => {
  const tokens = parse(pattern);
  const mappedQuery = { ...query }
  const mapped = tokens.map((item) => {
    if (item instanceof Object) {
      if (
        (item.modifier === '?' && mappedQuery[item.name]) ||
        !item.modifier
      ) {
        delete mappedQuery[item.name]
        return `/${query[item.name]}`;  
      }
      if (item.modifier === '?') {
        return '';
      }
    }
    return item;
  })
  const queryString = stringify(mappedQuery);
  if (queryString) {
    return `${mapped.join('')}?${queryString}`;
  }
  return mapped.join('')  
}