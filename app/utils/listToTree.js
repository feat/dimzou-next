import listToTreeLite from 'list-to-tree-lite';
const listToTree = (list, opts) =>
  listToTreeLite(JSON.parse(JSON.stringify(list)), opts);
export default listToTree;
