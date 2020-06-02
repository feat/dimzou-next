export default function getLineHeight(element) {
  // let temp = document.createElement(element.nodeName);
  let temp = element.cloneNode(true);
  // temp.setAttribute(
  //   "style",
  //   `margin:0px;padding:0px;font-family:${element.style.fontFamily};font-size:${
  //     element.style.fontSize
  //   }`
  // );
  temp.innerHTML = "test";
  temp = element.parentNode.appendChild(temp);
  const ret = temp.clientHeight;
  temp.parentNode.removeChild(temp);
  return ret;
}
