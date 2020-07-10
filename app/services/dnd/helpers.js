/*------------------------------------------------*/
/* LIBRARIES
/*------------------------------------------------*/
import throttle from 'lodash/throttle';

/*------------------------------------------------*/
/* INTERNAL DEPENDENCIES
/*------------------------------------------------*/

/*------------------------------------------------*/
/* CONSTANTS
/*------------------------------------------------*/
const OFFSET = 50;
const PX_DIFF = 4;

/*------------------------------------------------*/
/* GLOBAL VARIABLES
/*------------------------------------------------*/
let scrollIncrement = 0;
let isScrolling = false;
let containerEl = null;
const inSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
/*------------------------------------------------*/
/* METHODS
/*------------------------------------------------*/

/**
 * Scroll up in the sidebar.
 */
const goUp = () => {
  scrollIncrement -= PX_DIFF;
  containerEl.scrollTop = scrollIncrement;

  if (isScrolling && scrollIncrement >= 0) {
    window.requestAnimationFrame(goUp);
  }
};

/**
 * Scroll down in the sidebar.
 */
const goDown = () => {
  scrollIncrement += PX_DIFF;
  containerEl.scrollTop = scrollIncrement;  

  if (isScrolling && scrollIncrement <= containerEl.scrollHeight) {
    window.requestAnimationFrame(goDown);
  }
};

const onDragOver = (event) => {
  const clientRect = containerEl.getBoundingClientRect();
  const isMouseOnTop = (
    scrollIncrement >= 0 && event.clientY > clientRect.top
    && event.clientY < (clientRect.top + OFFSET)
  );
  const isMouseOnBottom = (
    scrollIncrement <= containerEl.scrollHeight
    && event.clientY > (clientRect.bottom - OFFSET)
    && event.clientY <= clientRect.bottom
  );
  if (!isScrolling && (isMouseOnTop || isMouseOnBottom)) {
    isScrolling = true;
    scrollIncrement = containerEl.scrollTop;

    if (isMouseOnTop) {
      window.requestAnimationFrame(goUp);
    }
    else {
      window.requestAnimationFrame(goDown);
    }
  }
  else if (!isMouseOnTop && !isMouseOnBottom) {
    isScrolling = false;
  }
};

/**
 * The "throttle" method prevents executing the same function SO MANY times.
 */
const throttleOnDragOver = throttle(onDragOver, 300);

// IMPORTANT: CALL THIS METHOD IN: beginDrag!!!
export const addEventListenerFor = (el) => {
  if (inSafari) {
    containerEl = el;
    el.addEventListener('dragover', throttleOnDragOver);
  }
};

// IMPORTANT: CALL THIS METHOD IN: endDrag!!!
export const removeEventListenerFor = (el) => {
  if (inSafari) {
    //   containerEl = null;
    isScrolling = false;
    el.removeEventListener('dragover', throttleOnDragOver);
    throttleOnDragOver.cancel();
  }
};


