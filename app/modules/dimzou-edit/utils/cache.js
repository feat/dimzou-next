import { getCache, initCache } from "@/services/cache";

export function getNodeCache(nodeId) {
  return getCache(`dimzou_node:${nodeId}`);
}

export function initNodeCache(nodeId, userId, reinit) {
  return initCache({
    cacheKey:`dimzou_node:${nodeId}`,
    userId,
  }, reinit)
}

export function appendingBlockKey ({ nodeId, pivotId }) {
  return `appending_${nodeId}_${pivotId}`
}

export function blockKey({ nodeId, blockId }) {
  return `block_${nodeId}_${blockId}`
}

export function rewordingKey({ nodeId, rewordingId }) {
  return `rewording_${nodeId}_${rewordingId}`;
}