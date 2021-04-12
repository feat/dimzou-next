import { stringify } from 'query-string';

const concatPath = (base, query, hash) => {
  if (!base) {
    throw new Error('base is required.');
  }
  const queryStr = stringify(query);
  if (queryStr && hash) {
    return `${base}?${queryStr}${hash}`;
  }
  if (queryStr) {
    return `${base}?${queryStr}`;
  }
  if (hash) {
    return `${base}${hash}`;
  }
  return base;
};

function getPublicationPath(data) {
  const { pageName, nodeId, bundleId, ...query } = data.query;
  return concatPath(
    nodeId
      ? `/dimzou-publication/${bundleId}/${nodeId}`
      : `/dimzou-publication/${bundleId}`,
    query,
    data.hash,
  );
}

function getDraftPath(data) {
  const { pageName, bundleId, nodeId, ...query } = data.query;
  return concatPath(
    nodeId ? `/draft/${bundleId}/${nodeId}` : `/draft/${bundleId}`,
    query,
    data.hash,
  );
}

function getUserPath(data) {
  const { pageName, userId, ...query } = data.query;
  return concatPath(`/profile/${userId}/dimzou`, query, data.hash);
}

function getQueryPath(data) {
  const { pageName, ...query } = data;
  return concatPath('/dimzou-query', query, data.hash);
}

function getCreatePath(data) {
  const { pageName, ...query } = data.query;
  return concatPath('/draft/new', query, data.hash);
}

const getDashboardPath = getUserPath;

/**
 * @param { query: {}, hash: '' } data
 */
export function getAsPath(data) {
  const { pageName } = data.query;

  switch (pageName) {
    case 'view':
      return getPublicationPath(data);
    case 'draft':
      return getDraftPath(data);
    case 'dashboard':
      return getDashboardPath(data);
    case 'create':
      return getCreatePath(data);
    case 'user':
      return getUserPath(data);
    default:
      return getQueryPath(data);
  }
}

export function isContentHash(str) {
  return str && /^#content-/.test(str);
}
