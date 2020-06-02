import deepmerge from 'deepmerge';
// import uniq from 'lodash/uniq';

const merge = (origin, received) =>
  deepmerge(origin, received, {
    arrayMerge: (_, source) =>
      source
      // return uniq([...destination, ...source]);
    ,
  });

export default merge;
