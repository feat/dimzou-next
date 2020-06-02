export function isDirty(values, initialValues) {
  if (values === null) {
    return values !== initialValues;
  }
  return Object.keys(values).some((key) => {
    if (typeof values[key] === 'object' && typeof initialValues[key] === 'object') {
      return isDirty(values[key], initialValues[key]);
    }
    return values[key] !== initialValues[key];
  })
}
