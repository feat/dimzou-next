import { initCache, getCache } from '@/services/cache';

export function initBundleCache({ entityType, entityId }, userId, reinit) {
  return initCache({
    cacheKey: `comment_bundle:${entityType}_${entityId}`,
    userId,
  }, reinit);
}

export function getBundleCache({ entityType, entityId }) {
  return getCache(`comment_bundle:${entityType}_${entityId}`);
}

export function replyKey(key) {
  return `reply_${key}`;
}