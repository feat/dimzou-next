import requestAnimateFrame from "./requestFrameFunc";
import thorttle from "./throttle";

const reqAnimFrame = requestAnimateFrame();

export function getScrollTop() {
  let scrollTop = 0;

    
  let bodyScrollTop = 0;

    
  let documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
  return scrollTop;
}

let scrollCache = 0;
function isScrollUp() {
  const current = getScrollTop();
  const scrollUp = scrollCache > current;
  scrollCache = current;
  return scrollUp;
}

const getIsScrollUp = thorttle(isScrollUp, 50);

export { getIsScrollUp };


export function getOffsetTop(element) {
  if (!element || !element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width || rect.height) {
    const doc = element.ownerDocument;
    const docElem = doc.documentElement;
    return rect.top - docElem.clientTop;
  }

  return rect.top;
}

export function addEventListener(event, handler, stopCapture) {
  document.addEventListener(event, handler, stopCapture);
  return {
    remove: () => {
      document.removeEventListener(event, handler);
    },
  };
}

export const easeInOutCubic = (t, b, c, d) => {
  const cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return cc / 2 * t * t * t + b;
  }
  return cc / 2 * ((t -= 2) * t * t + 2) + b;
};

export function scrollTo(href, offsetTop = 0, target = window, callback = () => {}) {
  const scrollTop = getScrollTop(window, true);
  const targetElement = document.getElementById(href.substring(1));
  if (!targetElement) {
    return;
  }
  const eleOffsetTop = getOffsetTop(targetElement);
  const targetScrollTop = scrollTop + eleOffsetTop - offsetTop;
  const startTime = Date.now();
  const frameFunc = () => {
    const timestamp = Date.now();
    const time = timestamp - startTime;
    window.scrollTo(window.pageXOffset, easeInOutCubic(time, scrollTop, targetScrollTop, 450));
    if (time < 450) {
      reqAnimFrame(frameFunc);
    } else {
      callback();
    }
  };
  reqAnimFrame(frameFunc);

  history.pushState(null, "", href);
}
