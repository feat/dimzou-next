// TODO: calc LINE_CHARACTER_COUNT, base on container width;
const LINE_CHARACTER_COUNT = 18;
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
  const paras = getParas(comment.content);
  const contentHeight = getContentHeight(paras);
  const headerHeight = 2;
  const metaHeight = 2;
  const marginBottomHeight = 1.5;
  return headerHeight + metaHeight + contentHeight + marginBottomHeight;
};

const subCommentHeight = (comment) => {
  const paras = getParas(comment.content);
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
    const [stackComments, stackHeight] = stack;
    const [comment, commentHeight] = item;
    const calc = stackHeight + commentHeight;
    // 样式中使用 column-count 以及 column-span 实现分页展示效果，所以此处使用 2 页作为划分基准
    if (calc > PAGE_LINE_COUNT * 2) {
      slices.push(stack);
      return [[comment], commentHeight];
    }
    stackComments.push(comment);
    return [stackComments, calc];
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
