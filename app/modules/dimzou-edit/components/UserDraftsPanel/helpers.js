export const getOutline = (data) => {
  const { section: { title_paragraphs } } = data;
  const items = Object.values(title_paragraphs).map((item) => ({
    id: item.paragraph_id,
    sort: item.paragraph_sort,
    label: item.paragraph_title,
  })).sort((a, b) => a.sort - b.sort);
  return items;
}

export const isSameNode = (nodeQuery, routerQuery) => (
  String(nodeQuery.bundleId) === String(routerQuery.bundleId) && 
    String(nodeQuery.nodeId) === String(routerQuery.nodeId) && 
    String(nodeQuery.isPublicationView) === String(routerQuery.isPublicationView)
)