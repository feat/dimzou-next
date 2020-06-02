export default function (html) {
  if (!html) {
    return '';
  }
  const dom = document.createElement('div');
  dom.innerHTML = html;
  dom.removeChild(dom.children[0]);
  return dom.innerHTML;
}
