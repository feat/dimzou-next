import { combineActions } from 'redux-actions';
import uniq from 'lodash/uniq';
import update from 'immutability-helper';
import { normalize } from 'normalizr';
import { mapHandleActions } from '@/utils/reducerCreators';
import merge from '@/utils/merge';
import { rewordingComment as rewordingCommentSchema } from '@/schema';

import {
  createRewordingComment,
  deleteRewordingComment,
  initRewordingCommentBundle,
  receiveRewordingComment,
  removeRewordingComment,
  fetchRewordingCommentTree,
  updateRewordingComment,
  receiveUpdatedRewordingComment,
  increaseRootCount,
  decreaseRootCount,
  registerRewordingCommentBundle,
  loadNodeEditInfo,
  patchContent,
} from '../actions';

export const initialBundleState = {
  isInitialized: false,
  isFetchingComments: false,
  comments: [],
  pagination: null,
  rootCount: 0,
  entities: {},
};

const rewordingCommentReducer = mapHandleActions(
  {
    [registerRewordingCommentBundle]: (bundleState, action) => {
      const base = {
        ...bundleState,
        rootCount: action.payload.rootCount,
      }
      const { initialData } = action.payload;
      if (initialData) {
        const normalized = normalize(initialData, [rewordingCommentSchema]);
        base.comments = normalized.result;
        base.entities = normalized.entities;
        base.isInitialized = true;
      }      
      return base;
    },
    [initRewordingCommentBundle]: (bundleState) => ({
      ...bundleState,
      isInitialized: true,
    }),
    [fetchRewordingCommentTree.REQUEST]: (bundleState) => ({
      ...bundleState,
      isFetchingComments: true,
    }),
    [fetchRewordingCommentTree.SUCCESS]: (bundleState, action) => ({
      ...bundleState,
      comments: uniq([...bundleState.comments, ...action.payload.list]),
      pagination: action.payload.pagination,
      entities: merge(bundleState.entities, action.payload.bundleEntities),
      isInitialized: true,
      rootCount: action.payload.pagination.total_count,
      isFetchingComments: false,
    }),
    [fetchRewordingCommentTree.FULFILL]: (bundleState) => ({
      ...bundleState,
      isFetchingComments: false,
    }),

    [combineActions(deleteRewordingComment.SUCCESS, removeRewordingComment)]: (
      bundleState,
      action,
    ) => {
      const { commentId, parentId } = action.payload;
      if (!parentId) {
        return update(bundleState, {
          rootCount: {
            $set: Math.max(0, bundleState.rootCount - 1),
          },
          comments: (list) => list.filter((id) => id !== commentId),
          entities: {
            [rewordingCommentSchema.key]: {
              $unset: [commentId],
            },
          },
        })
      }
      return update(bundleState, {
        entities: {
          [rewordingCommentSchema.key]: {
            [parentId]: {
              children: (list) => list.filter((id) => id !== commentId),
            },
            [commentId]: () => undefined,
          },
        },
      });
    },

    [combineActions(createRewordingComment.SUCCESS, receiveRewordingComment)]: (
      bundleState,
      action,
    ) => {
      const { commentId, parentId, bundleEntities } = action.payload;
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
        entities: update(bundleEntitiesPatched, {
          [rewordingCommentSchema.key]: {
            [parentId]: (comment) => {
              if (!comment) {
                return undefined;
              }
              return ({
                ...comment,
                children: comment.children ? uniq([...(comment.children), commentId]) : [commentId],
              })
            },
          },
        }),
      };
    },

    [combineActions(
      updateRewordingComment.SUCCESS,
      receiveUpdatedRewordingComment,
    )]: (bundleState, action) => {
      const { bundleEntities } = action.payload;
      const bundleEntitiesPatched = merge(bundleState.entities, bundleEntities);
      return {
        ...bundleState,
        entities: bundleEntitiesPatched,
      };
    },

    [increaseRootCount]: (bundleState) => ({
      ...bundleState,
      rootCount: (bundleState.rootCount || 0) + 1,
    }),

    [decreaseRootCount]: (bundleState) => ({
      ...bundleState,
      rootCount: (bundleState.rootCount || 1) - 1,
    }),
  },
  initialBundleState,
  (action) => action.payload.rewordingId,
);

const getInitialState = (r, nodeId) => {
  const state = {
    nodeId,
    rewordingId: r.id,
    rootCount: r.comments_count,
  };
  if (r.comments) {
    const normalized = normalize(r.comments, [rewordingCommentSchema]);
    state.comments = normalized.result;
    state.entities = normalized.entities;
    state.isInitialized = true;
  }
  return state;
}

const initCommentBundleWithNodeInfo = (state={}, action) => {
  const newState = { ...state };
  const { data } = action.payload;
  let hasUpdate = false;
  if (data.title && data.title.rewordings) {
    data.title.rewordings.forEach((r) => {
      if (!newState[r.id]) {
        hasUpdate = true;
        newState[r.id] = getInitialState(r, data.id);
      }
    })
  }
  if (data.summary && data.summary.rewordings) {
    data.summary.rewordings.forEach((r) => {
      if (!newState[r.id]) {
        hasUpdate = true;
        newState[r.id] = getInitialState(r, data.id);
      }
    })
  }
  if (data.cover && data.cover.rewordings) {
    data.cover.rewordings.forEach((r) => {
      if (!newState[r.id]) {
        hasUpdate = true;
        newState[r.id] = getInitialState(r, data.id);
      }
    })
  }
  if (data.content) {
    data.content.forEach((block) => {
      block.rewordings && block.rewordings.forEach((r) => {
        if (!newState[r.id]) {
          hasUpdate = true;
          newState[r.id] = getInitialState(r, data.id);
        }
      })
    })
  }
  if (hasUpdate) {
    return newState;
  }
  return state;
}

const reducer = (state, action) => {
  if (
    action.type === loadNodeEditInfo.toString() ||
    action.type === patchContent.toString()
  ) {
    return initCommentBundleWithNodeInfo(state, action);
  }

  return rewordingCommentReducer(state, action);
}

export default reducer;

