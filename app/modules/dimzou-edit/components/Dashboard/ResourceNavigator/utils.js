import get from 'lodash/get';
import { NODE_TYPE_CHAPTER } from '../../../constants';
import { getVersionLabel } from '../../../utils/bundle';
// output Array<ResourceDesc>
// { type: 'collection|leaf', bundleId: string, nodeId: string, label: string }
const defaultOptions = { includeHeader: false };

export function flattenResource(arr = [], options = defaultOptions) {
  const output = [];

  arr.forEach((bundle) => {
    const versionLabel = getVersionLabel(bundle);
    const bundleDesc = {
      id: `bundle-${bundle.id}`,
      bundleId: bundle.id,
      nodeId: get(bundle, 'nodes.0.id', undefined),
      label: versionLabel ? `${bundle.title} ${versionLabel}` : bundle.title,
      desc: bundle.summary,
      updatedAt: new Date(bundle.last_modified).valueOf(),
      sort: 0,
    };
    if (bundle.is_multi_chapter) {
      bundleDesc.type = 'collection';

      bundle.nodes
        .filter((node) => node.node_type === NODE_TYPE_CHAPTER)
        .forEach((node) => {
          const nodeDesc = {
            type: 'leaf',
            id: `node-${node.id}`,
            parentId: `bundle-${bundle.id}`,
            bundleId: bundle.id,
            nodeId: node.id,
            label: node.text_title,
            desc: node.text_summary,
            sort: node.sort,
          };
          if (options.includeHeader) {
            Object.values(node.section.title_paragraphs).forEach((item) => {
              output.push({
                type: 'header',
                id: `content-${item.paragraph_id}`,
                parentId: `node-${node.id}`,
                bundleId: bundle.id,
                nodeId: node.id,
                blockId: item.paragraph_id,
                label: item.paragraph_title,
                sort: item.paragraph_sort,
              });
            });
          }
          output.push(nodeDesc);
        });
    } else {
      const node = get(bundle, 'nodes.0');
      bundleDesc.nodeId = get(node, 'id', undefined);
      bundleDesc.type = 'leaf';
      if (node && options.includeHeader) {
        Object.values(node.section.title_paragraphs).forEach((item) => {
          output.push({
            type: 'header',
            id: `content-${item.paragraph_id}`,
            parentId: `bundle-${bundle.id}`,
            bundleId: bundle.id,
            nodeId: node.id,
            blockId: item.paragraph_id,
            label: item.paragraph_title,
            sort: item.paragraph_sort,
          });
        });
      }
    }
    output.push(bundleDesc);
  });

  return output;
}

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
