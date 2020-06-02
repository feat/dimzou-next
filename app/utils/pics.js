import get from 'lodash/get';
export function getImage(map, size='md', fallback) {
  return get(map, ['sizes', size, 'path'], fallback);
}