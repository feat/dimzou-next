import { comment as commentSchema } from './schema';
export const REDUCER_KEY = 'comment';
export function getBundleKey(payload = {}) {
  const { entityType, entityId } = payload;
  if (!entityType) {
    logging.warn('entityType is required');
  }
  if (!entityId) {
    logging.warn('entityId is required');
  }
  return `${entityType}_${entityId}`;
}

export const initialBundleState = {
  isInitialized: false,
  isFetchingComments: false,
  comments: [],
  pagination: null,
  rootCount: 0,
  entities: {
    [commentSchema.key]: {},
  },
  instances: {},
};
