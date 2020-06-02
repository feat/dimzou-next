import { INLINE_STYLE } from '../constants';

// DOCS: https://github.com/sstur/draft-js-utils/tree/master/packages/draft-js-import-html

const DATA_ATTRIBUTE = /^data-([a-z0-9-]+)$/;

// Map element attributes to entity data.
const ELEM_ATTR_MAP = {
  a: { href: 'url', rel: 'rel', target: 'target', title: 'title' },
  img: { src: 'src', alt: 'alt' },
};

const getElementData = (tagName, element, externalAttrMap) => {
  const data = {};
  const attrMap = externalAttrMap || ELEM_ATTR_MAP[tagName];
  if (attrMap) {
    for (let i = 0; i < element.attributes.length; i += 1) {
      const { name, value } = element.attributes[i];
      if (value != null) {
        if (Object.prototype.hasOwnProperty.call(attrMap, name)) {
          const newName = attrMap[name];
          data[newName] = value;
        } else if (DATA_ATTRIBUTE.test(name)) {
          data[name] = value;
        }
      }
    }
  } else {
    const dataset = element.dataset;
    // safari does not support direct forEach on dataset;
    if (!dataset) {
      return data;
    }
    Object.keys(dataset).forEach((key) => {
      data[key] = dataset[key];
    });
  }
  return data;
};

const elemAttrMap = {};
const customBlockFn = (element) => {
  const tagName = element.nodeName.toLowerCase();
  const data = getElementData(tagName, element, elemAttrMap[tagName]);
  if (tagName === 'pre') {
    // jsdom do not support dataset;
    data.language = element.children[0].getAttribute('data-language');
  }
  return {
    data,
  };
};

const customInlineFn = (element, { Style }) => {
  if (element.tagName === 'SPAN' && element.className === 't-light') {
    return Style(INLINE_STYLE.LIGHT);
  }
  if (element.tagName === 'CODE' && element.parentNode.tagName === 'PRE') {
    return {};
  }
  return null;
};

export default {
  customInlineFn,
  customBlockFn,
};
