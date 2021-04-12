import { TAILING_PIVOT, BEGINNING_PIVOT } from '../constants';

if (typeof window === 'object') {
  (() => {
    import('child-replace-with-polyfill');
  })();
}

function unwrap(el) {
  const parent = el.parentNode;
  if (!parent) {
    return;
  }
  // move all children out of the element
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  parent.removeChild(el);
}

function createConfirmedDom(html) {
  const dom = document.createElement('div');
  dom.innerHTML = html;
  Array.prototype.forEach.call(
    dom.querySelectorAll('[data-entity-type="annotation:add"]'),
    (el) => {
      unwrap(el);
    },
  );
  Array.prototype.forEach.call(
    dom.querySelectorAll('[data-entity-type="annotation:delete"]'),
    (el) => {
      el.parentNode.removeChild(el);
    },
  );
  Array.prototype.forEach.call(
    dom.querySelectorAll('[data-entity-type="annotation:style"]'),
    (el) => {
      unwrap(el);
    },
  );

  if (dom.children.length === 1) {
    const node = dom.children[0];
    const mayEmptyBlock = {
      H1: 1,
      H2: 1,
      H3: 1,
      H4: 1,
      H5: 1,
      H6: 1,
      P: 1,
    };
    if (mayEmptyBlock[node.tagName] && node.innerText === '') {
      node.innerHTML = '<br/>';
    }
  }

  return dom;
}

export function getBaseHTML(html) {
  const dom = document.createElement('div');
  dom.innerHTML = html;
  Array.prototype.forEach.call(
    dom.querySelectorAll('[data-entity-type="annotation:add"]'),
    (el) => {
      el.parentNode.removeChild(el);
    },
  );
  Array.prototype.forEach.call(
    dom.querySelectorAll('[data-entity-type="annotation:delete"]'),
    (el) => {
      unwrap(el);
    },
  );
  Array.prototype.forEach.call(
    dom.querySelectorAll('[data-entity-type="annotation:style"]'),
    (el) => {
      unwrap(el);
    },
  );
  return dom.innerHTML;
}

export function getConfirmedHTML(html) {
  const dom = createConfirmedDom(html);
  return dom.innerHTML;
}

export function getConfirmedText(html) {
  const dom = createConfirmedDom(html);
  return dom.innerText;
}

export const getParagraphsFromHTML = (html) => {
  const dom = document.createElement('div');
  dom.innerHTML = html;
  const paragraphs = [];
  Array.prototype.forEach.call(dom.children, (el) => {
    paragraphs.push(el.outerHTML);
  });
  return paragraphs;
};

export function splitContent({ htmlContent }) {
  const dom = document.createElement('div');
  dom.innerHTML = htmlContent;
  logging.debug(htmlContent);
  const paragraphs = [];
  Array.prototype.forEach.call(dom.children, (el) => {
    const blockHTML = el.outerHTML;
    const blockText = el.innerText;
    // const rawData = convertToRaw(createFromHTML(blockHTML));
    paragraphs.push({
      content: blockText,
      html_content: blockHTML,
      // content_meta: rawData,
    });
  });
  return paragraphs;
}

export function isHeading(html, level) {
  if (!level) {
    return /<h(\d+).*>(.*)<\/h\1>/s.test(html);
  }
  const matchedLevel = getHeadingLevel(html);
  return String(level) === matchedLevel;
}

export function getHeadingLevel(html) {
  const matched = /<h(\d+).*>(.*)<\/h\1>/s.exec(html);
  return matched ? matched[1] : 0;
}

export function combineBlockList(contentList, appendings, capabilities = {}) {
  const list = [...contentList];
  const appendingKeys = Object.keys(appendings);
  appendingKeys.forEach((key) => {
    //  BEGINNING_PIVOT is a number
    // eslint-disable-next-line eqeqeq
    if (key === TAILING_PIVOT || key == BEGINNING_PIVOT) {
      return;
    }
    // eslint-disable-next-line eqeqeq
    const index = list.findIndex((a) => a == key);
    list.splice(index + 1, 0, `a.${key}`);
  });
  // handle tailing pivot
  if (appendings[TAILING_PIVOT]) {
    list.splice(list.length, 0, `a.${TAILING_PIVOT}`);
  }

  list.splice(0, 0, BEGINNING_PIVOT);
  if (appendings[BEGINNING_PIVOT]) {
    list.splice(1, 0, `a.${BEGINNING_PIVOT}`);
  }

  if (!appendingKeys.length && capabilities.canAppendContent) {
    list.splice(list.length, 0, `a.${TAILING_PIVOT}`);
  }

  return list;
}

export function isInternalBlock(blockId) {
  return (
    blockId === BEGINNING_PIVOT ||
    blockId === TAILING_PIVOT ||
    isAppendingBlock(blockId)
  );
}

export function isAppendingBlock(blockId) {
  return /^a\..+/.test(blockId);
}

// const appendingIdRegex = new RegExp(
//   `a\\\.(?<id>\\\d+|${BEGINNING_PIVOT}|${TAILING_PIVOT})`,
// );
// export function isAppending(appendings, blockId) {
//   const appendingId = appendingIdRegex.exec(blockId);
//   // XXX: 看上面的combineBlockList，a.TAILING_PIVOT可能在blockList里但是不在appendings里
//   return (
//     appendingId &&
//     (appendingId.groups.id === TAILING_PIVOT ||
//       appendings[appendingId.groups.id])
//   );
// }

export function mapArray(arr, key = 'id') {
  const list = [];
  const map = {};
  arr.forEach((item) => {
    list.push(item[key]);
    map[item[key]] = item;
  });
  return [list, map];
}
