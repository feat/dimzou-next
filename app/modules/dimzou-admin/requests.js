import request from '@/utils/request'

const getSubPath = (type) => {
  switch (type) {
    case 'commented':
      return 'commented-bundles';
    case 'created':
      return 'created-bundles';
    case 'edited':
      return 'edited-drafts';
    case 'invited':
      return 'invited-drafts';
    case 'liked':
      return 'liked-bundles';
    case 'read':
      return 'read-bundles';
    default :
      return 'created-bundles';
  }
}

export const fetchDimzouList = (payload) => {
  const { type, ...params } = payload;
  const subPath = getSubPath(type);
  return request({
    url: `/api/dimzou/user-bundle-history/${subPath}/`,
    method: 'GET',
    params,
  });
}