export default function getHeadings(html) {
  const dom = document.createElement('div');
  dom.innerHTML = html;
  const headers = dom.querySelectorAll('h2');
  return [...headers].map((node, index) => ({
    id: `title-${index + 1}`, // 此处需要与 RichContnet 组件配合
    label: node.innerText,
  }));
}
