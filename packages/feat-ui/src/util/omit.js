function omit(obj, arr = []) {
  const newObj = Object.assign({}, obj);
  arr.forEach((item) => {
    delete newObj[item];
  });
  return newObj;
}

export default omit;
