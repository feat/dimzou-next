/* eslint-disable */
function ReplaceWith(Ele) {
  'use-strict';

  // For safari, and IE > 10
  let parent = this.parentNode,
    i = arguments.length,
    firstIsNode = +(parent && typeof Ele === 'object');
  if (!parent) return;

  while (i-- > firstIsNode) {
    if (parent && typeof arguments[i] !== 'object') {
      arguments[i] = document.createTextNode(arguments[i]);
    }
    if (!parent && arguments[i].parentNode) {
      arguments[i].parentNode.removeChild(arguments[i]);
      continue;
    }
    parent.insertBefore(this.previousSibling, arguments[i]);
  }
  if (firstIsNode) parent.replaceChild(Ele, this);
}
if (typeof Element === 'object' && !Element.prototype.replaceWith) {
  Element.prototype.replaceWith = ReplaceWith;
}
if (typeof CharacterData === 'object' && !CharacterData.prototype.replaceWith) {
  CharacterData.prototype.replaceWith = ReplaceWith;
}
if (typeof DocumentType === 'object' && !DocumentType.prototype.replaceWith) {
  DocumentType.prototype.replaceWith = ReplaceWith;
}

function unwrap(el) {
  var parent = el.parentNode;
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
      'H1': 1,
      'H2': 1,
      'H3': 1,
      'H4': 1,
      'H5': 1,
      'H6': 1,
      'P': 1,
    }
    if (
      mayEmptyBlock[node.tagName] && node.innerText === ''
    ) {
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
    }
  )
  Array.prototype.forEach.call(
    dom.querySelectorAll('[data-entity-type="annotation:style"]'),
    (el) => {
      unwrap(el);
    }
  )
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