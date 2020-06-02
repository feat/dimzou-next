// TODO: calc LINE_CHARACTER_COUNT, base on container width;
const LINE_CHARACTER_COUNT = 48;
const PAGE_LINE_COUNT = 34;

const getParas = (html) => {
  const dom = document.createElement('div');
  dom.innerHTML = html;
  const blocks = Array.prototype.map.call(dom.children, (n) => n.innerText);
  return blocks;
};

const getParaHeight = (text) =>
  Math.ceil(text.length / LINE_CHARACTER_COUNT) + 0.5;

const getContentHeight = (paras) => {
  const paraHeights = paras.map((text) => getParaHeight(text));
  const contentHeight = paraHeights.reduce((a, b) => a + b, 0);
  return contentHeight;
};

const rootCommentHeight = (comment) => {
  const paras = getParas(comment.htmlContent);
  const contentHeight = getContentHeight(paras);
  const headerHeight = 2;
  const metaHeight = 2;
  const marginBottomHeight = 1.5;
  return headerHeight + metaHeight + contentHeight + marginBottomHeight;
};

const subCommentHeight = (comment) => {
  const paras = getParas(comment.htmlContent);
  const contentHeight = getContentHeight(paras);
  const metaHeight = 2;
  const marginBottomHeight = 1.5;
  return metaHeight + contentHeight + marginBottomHeight;
};

const getCommentHeight = (comment) => {
  if (!comment.parentId) {
    return [comment, rootCommentHeight(comment)];
  }
  return [comment, subCommentHeight(comment)];
};

export const sliceComments = (comments, initialStack = [[], 0]) => {
  const commentStack = comments.map((c) => getCommentHeight(c));
  const slices = [];
  const lastStack = commentStack.reduce((stack, item) => {
    // stackHeight, itemHeight
    const calc = stack[1] + item[1];
    if (calc > PAGE_LINE_COUNT) {
      slices.push(stack);
      return [[item[0]], item[1]];
    }
    return [[...stack[0], item[0]], calc];
  }, initialStack);
  slices.push(lastStack);
  return slices;
};

export function nodeToFlatList(node, childProps = 'children', parent = null) {
  const list = [];
  if (parent) {
    list.push({
      ...node,
      parentInfo: {
        id: parent.id,
        author: parent.user,
      },
    });
  } else {
    list.push(node);
  }
  const children = node[childProps] || [];
  if (children.length === 0) {
    return list;
  }
  const flatWithChildren = list.concat(
    treeToFlatList(children, childProps, node),
  );

  return flatWithChildren;
}

export function treeToFlatList(nodes, childProps = 'children', parent = null) {
  const flatItems = nodes.map((node) =>
    nodeToFlatList(node, childProps, parent),
  );
  const list = flatItems.reduce((a, b) => a.concat(b), []);
  return list;
}
