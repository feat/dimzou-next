export default function shrinkText(el, inputOptions) {
  if (!el) {
    return;
  }
  const options = Object.assign({}, shrinkText.defaults, inputOptions);
  let minFontSize;
  const baseFontSize = window.getComputedStyle(
    document.getElementsByTagName('head')[0],
  ).fontSize;

  if (options.minFontSize.indexOf('px')) {
    minFontSize = parseFloat(options.minFontSize);
  } else if (options.minFontSize.indexOf('rem')) {
    minFontSize = parseFloat(options.minFontSize) * parseFloat(baseFontSize);
  } else {
    minFontSize = parseFloat(shrinkText.defaults.minFontSize);
  }

  const style = window.getComputedStyle(el);
  const shadowContainer = document.createElement('div');
  const shadow = document.createElement('span');
  const textNode = document.createTextNode(el.innerText);
  const targetWidth = parseFloat(style.width);
  let targetHeight = parseFloat(style.lineHeight) * options.lineCount;
  if (options.maxHeight) {
    targetHeight = options.maxHeight;
  }

  shadow.appendChild(textNode);

  shadowContainer.style.visibility = 'hidden';
  shadowContainer.style.position = 'absolute';
  shadowContainer.style.width = style.width;
  shadowContainer.style.zIndex = '-1';

  shadowContainer.appendChild(shadow);
  document.body.appendChild(shadowContainer);

  shadow.style.fontSize = style.fontSize;
  shadow.style.fontFamily = style.fontFamily;
  shadow.style.fontWeight = style.fontWeight;

  let shadowRect = shadow.getBoundingClientRect();

  if (shadowRect.width <= targetWidth && shadowRect.height <= targetHeight) {
    document.body.removeChild(shadowContainer);
    return;
  }
  // firefox下页面卡死 具体例子？
  while (shadowRect.width > targetWidth || shadowRect.height > targetHeight) {
    const originFontSize = parseFloat(shadow.style.fontSize);
    if (originFontSize < minFontSize) {
      shadow.style.fontSize = `${minFontSize}px`;
      break;
    }
    shadow.style.fontSize = `${parseFloat(shadow.style.fontSize) - 2}px`;
    shadowRect = shadow.getBoundingClientRect();
  }
  // clac rem;
  if (el.style.fontSize !== shadow.style.fontSize) {
    // eslint-disable-next-line
    el.style.fontSize = `${parseFloat(shadow.style.fontSize) /
      parseFloat(baseFontSize)}rem`;
  }

  document.body.removeChild(shadowContainer);
}

shrinkText.defaults = {
  minFontSize: '12px', // px or rem value;
  lineCount: 1,
};
