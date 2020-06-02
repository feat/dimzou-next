export function getAsPath(data) {
  const { query, hash = '' } = data;
  if (query.userId) {
    return `/profile/${query.userId}/dimzou`;
  }
    
  if (query.isPublicationView) {
    if (query.nodeId) {
      return `/dimzou-publication/${query.bundleId}/${query.nodeId}${hash}`
    }
    return `/dimzou-publication/${query.bundleId}${hash}`
  }

  if (query.nodeId) {
    return `/draft/${query.bundleId}/${query.nodeId}${hash}`
  }
  
  return `/draft/${query.bundleId}${hash}`
}