import isString from "lodash/isString";
import some from "lodash/some";

const splitRegex = /(?=[\s|，|。|？|、])/;

function getAverageCharWidth(element) {
  let temp = document.createElement(element.nodeName);
  temp.setAttribute(
    "style",
    `position:"absolute";margin:0px;padding:0px;font-family:${
      element.style.fontFamily
    };font-size:${element.style.fontSize}`
  );
  const testString = "ABCDEFGHIJKLMNOPQRSTUVW1234567890abcdefghijklmnopqrst";
  temp.innerText = testString;
  temp = element.parentNode.appendChild(temp);
  const width = temp.clientWidth || temp.offsetWidth;
  temp.parentNode.removeChild(temp);
  return width / testString.length;
}

function getClosestBlockDom(dom) {
  let closestBlockDom = dom;

  if (getComputedStyle(closestBlockDom).display !== "block") {
    for (; closestBlockDom.parentNode; ) {
      closestBlockDom = closestBlockDom.parentNode;
      if (getComputedStyle(closestBlockDom).display === "block") {
        break;
      }
    }
  }
  return closestBlockDom;
}

function appendEllipse(element, blockElement, ellipsis) {
  ellipsis = isString(ellipsis) ? ellipsis : "\u2026";
  element.lastChild &&
    !some(["...", "\u2026"], element.lastChild.nodeValue) &&
    element.appendChild(document.createTextNode(ellipsis));
  if (isOverFlow(blockElement)) {
    element.removeChild(element.lastChild);
    const lastChild = element.removeChild(element.lastChild);
    if (element.childNodes.length === 0) {
      element.appendChild(document.createTextNode(lastChild.data.slice(0, -5)));
    }
    appendEllipse(element, blockElement, ellipsis);
  }
}

function isOverFlow(element) {
  const fontSize = parseFloat(getComputedStyle(element).fontSize, 10);
  return element.scrollHeight - element.offsetHeight > 0.2 * fontSize;
}

export default function lineTruncate(dom, options) {
  const closestBlockDom = getClosestBlockDom(dom);
  let lastChild;

  // closestBlockDom should be overflow:hidden;
  closestBlockDom.style.overflow = "hidden";

  if (isOverFlow(closestBlockDom)) {
    const text = dom.innerText;
    if (text.length) {
      const charWidth = getAverageCharWidth(dom);
      const lineSize = dom.offsetWidth / charWidth;

      const areaSize = parseInt(lineSize * options.lines, 10);

      const words = text.split(splitRegex);
      let charCount = 0;
      dom.innerText = "";
      let i = 0;
      const wordsCount = words.length;

      for (; i < words.length; i++) {
        charCount += words[i].length + 1;
        if (charCount > areaSize) break;
        dom.appendChild(document.createTextNode(words[i]));
      }
      if (isOverFlow(closestBlockDom)) {
        do {
          lastChild = dom.removeChild(dom.lastChild);
        } while (isOverFlow(closestBlockDom));
        if (dom.childNodes.length === 0) {
          const originText = lastChild.data;
          let truncated = originText;
          do {
            truncated = truncated.slice(0, -5);
            dom.innerText = truncated;
          } while (isOverFlow(closestBlockDom));
        }
      } else {
        do {
          lastChild = document.createTextNode(words[i++]);
          dom.appendChild(lastChild);
        } while (!isOverFlow(closestBlockDom) && i < wordsCount);
        if (dom.childNodes.length > 1) {
          dom.removeChild(lastChild);
        }
      }
      options.ellipsis && appendEllipse(dom, closestBlockDom, options.ellipsis);
      closestBlockDom.style.overflow = "initial";
      options.callback && options.callback();
    }
  } else {
    closestBlockDom.style.overflow = "initial";
  }
}
