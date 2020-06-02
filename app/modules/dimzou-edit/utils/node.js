import { NODE_TYPE_CHAPTER, NODE_TYPE_COVER } from '../constants';

export function getCoverNode(nodes) {
  return nodes.find((item) => item.node_type === NODE_TYPE_COVER);
}

export function getChapterNodes(nodes) {
  return nodes.filter((item) => item.node_type === NODE_TYPE_CHAPTER);
}

export function classifyNodes(nodes) {
  const coverNode = getCoverNode(nodes);
  const chapterNodes = getChapterNodes(nodes);
  return {
    coverNode,
    chapterNodes,
  };
}

export function getRewordingLikesCount(node) {
  const likesMap = {};
  const getLikeCount = (item) => {
    likesMap[item.id] = item.likes_count;
  };
  node.title.rewordings && node.title.rewordings.forEach(getLikeCount);
  node.summary.rewordings && node.summary.rewordings.forEach(getLikeCount);
  node.cover.rewordings && node.cover.rewordings.forEach(getLikeCount);
  node.content.forEach((block) => {
    block.rewordings && block.rewordings.forEach(getLikeCount);
  });
  return likesMap;
}

export function getActiveHeading(hash, outline) {
  if (!hash) {
    return false;
  }
  if (!outline) {
    return false;
  }
  const heading = outline.find((item) => `#content-${item.id}` === hash);
  return heading;
}

export function getFakeLoadingTime(node) {
  let count = 0;
  node.title && node.title.rewordings && (count += node.title.rewordings.length);
  node.summary && node.summary.rewordings && (count += node.summary.rewordings.length);
  node.cover && node.cover.rewordings && (count += node.cover.rewordings.length);
  node.content && node.content.forEach((b) => {
    b.rewordings && (count += b.rewordings.length);
  })
  return Math.round(count / 100);
}