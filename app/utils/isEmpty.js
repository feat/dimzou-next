export default function isEmpty(val) {
  if (!val) {
    return true;
  }
  if (Array.isArray(val)) {
    return val.length === 0;
  }
  return Object.keys(val).length === 0;
}
