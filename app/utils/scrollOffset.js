/* eslint-disable */
const scrollOffset = (c, t) =>
  c === document
    ? t.getBoundingClientRect().top + (window.scrollY || window.pageYOffset)
    : getComputedStyle(c).position === 'relative'
      ? t.offsetTop
      : t.getBoundingClientRect().top + c.scrollTop;
/* eslint-enable */

export default scrollOffset;
