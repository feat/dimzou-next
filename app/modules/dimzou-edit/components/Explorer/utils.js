export function isRootLevel(nodes, node) {
  // find out if parent directory is in sub-tree
  const { parentId } = node;
  if (!parentId) return true;
  const parent = nodes.find((n) => n.id === parentId);
  if (!parent) return true;
  return false;
}

export function sortingFunction(a, b) {
  if (!b.sort && !a.sort) {
    return b.updatedAt - a.updatedAt;
  }
  if (!b.sort) {
    return -1;
  }
  return a.sort - b.sort;
}
