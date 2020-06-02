
import { ANNOTATION_ADD, ANNOTATION_DELETE, ANNOTATION_STYLE } from '../constants';
import { INLINE_STYLE } from '../../../constants';

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
    // hack for safari;
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
  if (element.tagName === 'PRE') {
    data.language = element.children[0].dataset.language;
  }
  return {
    data,
  };
};

const customInlineFn = (element, { Style, Entity }) => {
  let mutability;
  const tagName = element.nodeName.toLowerCase();
  const data = getElementData(tagName, element);
  const entityType = data.entityType;

  if (tagName === 'code' && element.parentNode.nodeName.toLowerCase() === 'pre') {
    return {};
  }

  if (tagName === 'span' && element.className === 't-light') {
    return Style(INLINE_STYLE.LIGHT);
  }

  switch (entityType) {
    case ANNOTATION_ADD:
    case ANNOTATION_DELETE:
      // mutability = data.userId === extraInfo.currentUser ? 'MUTABLE' : 'IMMUTABLE';
      break;
    case ANNOTATION_STYLE:
      // try {
      //   data.initStyle = List(JSON.parse(data.initStyle).map(style => OrderedSet(style)));
      // } catch (err) {
      //   data.initStyle = decodeStyleList(data.initStyle);
      // }
      mutability = 'IMMUTABLE';
      break;
    default:
  }
  if (entityType) {
    return Entity(entityType, data, mutability);
  }
  return null;
};

const statefromHTMLOptions = {
  // elemToEntity,
  customBlockFn,
  customInlineFn,
  elementStyles: undefined,
};

export default statefromHTMLOptions;
