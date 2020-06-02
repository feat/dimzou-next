/*
 *
 * CommentBundle reducer
 *
 */

import { combineActions } from 'redux-actions';
import uniq from 'lodash/uniq';
import update from 'immutability-helper';
import { normalize } from 'normalizr';
import merge from '@/utils/merge';
import { mapHandleActions } from '@/utils/reducerCreators';

import {
  comment as commentSchema,
} from '@/schema';

import {
  registerBundle,
  unregisterBundle,
  bundleInitialized,
  getCommentTree,
  createComment,
  deleteComment,
  receiveNewComment,
  removeComment,
  updateComment,
  receiveUpdatedComment,
} from '../actions';

const initialBundleState = {
  isInitialized: false,
  isFetchingComments: false,
  comments: [],
  pagination: null,
  rootCount: 0,
  entities: {
    [commentSchema.key]: {},
  },
  instances: {},
  createPayload: null,
};

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

const commentBundleReducer = mapHandleActions(
  {
    [registerBundle]: (bundleState, action) => {
      const { payload } = action;
      const next = {
        ...bundleState,
        rootCount: bundleState.rootCount || payload.rootCount,
        channel: payload.channel || bundleState.channel,
        instances: {
          ...bundleState.instances,
          [payload.instanceKey]: true,
        },
      };
      if (!bundleState.isInitialized && payload.initialData) {
        const normalized = normalize(payload.initialData, [commentSchema]);
        next.comments = normalized.result;
        next.entities = normalized.entities;
        // NOTE: may have bug, if initialData is not the entire list
        next.isInitialized = true;
      }
      return next;
    },
    [unregisterBundle]: (bundleState, action) => {
      const { payload } = action;
      return update(bundleState, {
        instances: (obj) => {
          const mapped = { ...obj };
          delete mapped[payload.instanceKey];
          return mapped;
        },
      });
    },
    [bundleInitialized]: (bundleState, action) => ({
      ...bundleState,
      cache: action.payload.bundleCache,
      isInitialized: true,
    }),
    [getCommentTree.REQUEST]: (bundleState) => ({
      ...bundleState,
      isFetchingComments: true,
    }),
    [getCommentTree.FULFILL]: (bundleState) => ({
      ...bundleState,
      isFetchingComments: false,
    }),
    [getCommentTree.SUCCESS]: (bundleState, action) => {
      const { payload } = action;
      return {
        ...bundleState,
        comments: uniq([...bundleState.comments, ...payload.list]),
        entities: merge(bundleState.entities, payload.bundleEntities),
        pagination: payload.pagination,
        next: payload.pagination.next,
        rootCount: payload.pagination.total_count,
      };
    },
    [getCommentTree.FAILURE]: (bundleState, action) => {
      const { payload } = action;
      return {
        ...bundleState,
        fetchCommentsError: payload.data,
      };
    },

    [createComment]: (bundleState, action) => {
      const { payload } = action;
      return {
        ...bundleState,
        createPayload: payload,
      };
    },

    [combineActions(createComment.SUCCESS, receiveNewComment)]: (
      bundleState,
      action,
    ) => {
      const { payload } = action;
      const { commentId, parentId, bundleEntities } = payload;
      const bundleEntitiesPatched = merge(bundleState.entities, bundleEntities);

      if (!parentId) {
        const originLength = bundleState.comments.length;
        const comments = uniq([commentId, ...bundleState.comments]);
        return {
          ...bundleState,
          rootCount:
            comments.length - originLength
              ? (bundleState.rootCount || 0) + 1
              : bundleState.rootCount,
          comments,
          entities: bundleEntitiesPatched,
        };
      }
      return {
        ...bundleState,
        createPayload: null,
        entities: update(bundleEntitiesPatched, {
          [commentSchema.key]: {
            [parentId]: {
              children: (list = []) => uniq([...list, commentId]),
            },
          },
        }),
      };
    },
    [combineActions(updateComment.SUCCESS, receiveUpdatedComment)]: (
      bundleState,
      action,
    ) => {
      const { payload } = action;
      return {
        ...bundleState,
        entities: merge(bundleState.entities, payload.bundleEntities),
      };
    },
    [combineActions(deleteComment.SUCCESS, removeComment)]: (
      bundleState,
      action,
    ) => {
      const { payload } = action;

      const { parentId, commentId } = payload;
      if (!parentId) {
        return {
          ...bundleState,
          rootCount: Math.max(0, bundleState.rootCount - 1),
          comments: bundleState.comments.filter((id) => id !== commentId),
        };
      }
      return {
        ...bundleState,
        entities: update(bundleState.entities, {
          [commentSchema.key]: {
            [parentId]: {
              children: (list) => list.filter((id) => id !== commentId),
            },
          },
        }),
      };
    },
  },
  initialBundleState,
  (action) => getBundleKey(action.payload),
);

export default commentBundleReducer;
export const REDUCER_KEY = 'commentBundle';
