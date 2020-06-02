export default function(obj, defaultValue) {
  if (!obj) {
    return defaultValue;
  }
  if (obj.toJS) {
    return obj.toJS();
  }
  return obj;
}
