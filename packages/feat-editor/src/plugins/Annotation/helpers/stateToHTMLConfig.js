import kebabCase from 'lodash/kebabCase';

import { BLOCK_TYPE } from '../../../constants';
import { ANNOTATION_DELETE, ANNOTATION_ADD, ANNOTATION_STYLE } from '../constants';

import commonConfig from '../../../config/stateToHTMLConfig';

const getEntityTags = (entityType) => {
  switch (entityType) {
    case ANNOTATION_DELETE:
      return 'span';
    case ANNOTATION_ADD:
      return 'span';
    default:
      return 'span';
  }
};

const getEntityData = (entity) => {
  const entityType = entity.getType();
  const data = entity.getData();
  switch (entityType) {
    case ANNOTATION_STYLE:
      return {
        entityType,
        initStyle: data.initStyle,
      };
    case ANNOTATION_DELETE:
    case ANNOTATION_ADD:
    default:
      data.entityType = entityType;
      return data;
  }
};

const dataAttributes = (obj = {}) => {
  const output = {};
  Object.keys(obj).forEach((key) => {
    output[`data-${kebabCase(key)}`] = obj[key];
  });
  return output;
};

const blockRenderers = {

};

const blockStyleFn = (block) => {
  const data = block.getData().toJS();
  const output = {};
  if (block.getType() === BLOCK_TYPE.CODE_BLOCK) {
    data.language = data.language || 'javascript';
    delete data.syntax;
  }
  Object.keys(data).forEach((key) => {
    output[`data-${kebabCase(key)}`] = data[key];
  });
  return {
    attributes: output,
  };
};

const entityStyleFn = (entity) => {
  const entityType = entity.get('type');
  if (
    entityType !== ANNOTATION_DELETE &&
    entityType !== ANNOTATION_ADD &&
    entityType !== ANNOTATION_STYLE
  ) {
    return null;
  }
  const tagName = getEntityTags(entityType);
  return {
    element: tagName,
    attributes: dataAttributes(getEntityData(entity)),
  };
};


export default {
  ...commonConfig,
  blockRenderers,
  blockStyleFn,
  entityStyleFn,
};
