import get from 'lodash/get';

export default function (object, propName) {
  if (!object) {
    return undefined;
  }
  return object[propName] || get(object, ['match', 'params', propName]);
}
