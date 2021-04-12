import { getCache, initCache } from '@/services/cache';

export function getNodeCache(nodeId) {
  return getCache(`dimzou_node:${nodeId}`);
}

export function initNodeCache(nodeId, userId, reinit) {
  return initCache(
    {
      cacheKey: `dimzou_node:${nodeId}`,
      userId,
    },
    reinit,
  );
}

export function appendingBlockKey({ pivotId }) {
  return `appending-${pivotId}`;
}

export function blockKey({ blockId, structure }) {
  return `block-${structure}-${blockId}`;
}

export function rewordingKey({ rewordingId }) {
  return `rewording-${rewordingId}`;
}
