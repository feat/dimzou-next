/*
 *
 * Comment actions
 *
 */

import { createRoutine } from 'redux-saga-routines';
import { createAction } from 'redux-actions';
import { normalize } from 'normalizr';

import Router from 'next/router';

import {
  comment as commentSchema,
} from '@/schema';

import {
  // getComment as getCommentRequest,
  getComments as getCommentsRequest,
  createComment as createCommentRequest,
  replyComment as replyCommentRequest,
  updateComment as updateCommentRequest,
  deleteComment as deleteCommentRequest,
  // getCommentReplies as getCommentRepliesRequest,
} from '@/client/comment';

import { hasAuthedUser } from '../auth/selectors';
import { selectCommentBundle } from './selectors';

const NS = 'COMMENT';

export const registerBundle = createAction(`${NS}/REGISTER_BUNDLE`);
export const unregisterBundle = createAction(`${NS}/UNREGISTER_BUNDLE`);
export const bundleInitialized = createAction(`${NS}/BUNDLE_INITIALIZED`);

export const createComment = createRoutine(`${NS}/CREATE_COMMENT`);

export const deleteComment = createRoutine(`${NS}/DELETE_COMMENT`);

export const updateComment = createRoutine(`${NS}/UPDATE_COMMENT`);

export const getCommentReplies = createRoutine(`${NS}/GET_COMMENT_REPLIES`);

export const getComment = createRoutine(`${NS}/GET_COMMENT`);
export const getCommentTree = createRoutine(`${NS}/FETCH_COMMENT_TREE`);

// For Comment Signals.
export const commentSignal = createAction(`${NS}/SIGNAL`);
export const receiveNewComment = createAction(`${NS}/RECEIVE_NEW_COMMENT`);
export const receiveUpdatedComment = createAction(
  `${NS}/RECEIVE_UPDATED_COMMENT`,
);
export const removeComment = createAction(`${NS}/REMOVE_COMMENT`);

export const asyncCreateComment = (payload) => async (dispatch, getState) => {
  const hasAuthed = hasAuthedUser(getState());
  if (!hasAuthed) {
    Router.push({
      pathname: '/auth/login',
      query: {
        redirect: window.location.pathname,
        action: true,
      },
    })
    return undefined;
  }
  const {
    entityType,
    entityId,
    content,
    parentId,
    conversationId,
  } = payload;
  try {
    const request = parentId ? replyCommentRequest : createCommentRequest;
    const { data: comment } = await request({
      entity_type: entityType,
      entity_id: entityId,
      parent_id: parentId,
      content,
    });
    const normalized = normalize(comment, commentSchema);
    const preData = {
      parentId: comment.parent_id,
      conversationId,
      entityType,
      entityId,
      commentId: comment.id,
      bundleEntities: normalized.entities,
    };
    dispatch(createComment.success(preData));
    return payload;
  } catch (err) {
    dispatch(
      createComment.failure({
        conversationId,
        entityType,
        entityId,
        parentId,
        data: err,
      }),
    );
    throw err;
  }
}

export const asyncDeleteComment = (payload) => async (dispatch) => {
  const { commentId, entityType, entityId, parentId, conversationId } = payload;
  try {
    await deleteCommentRequest(commentId);
    const preData = {
      commentId,
      entityType,
      entityId,
      parentId,
      conversationId,
    };
    dispatch(deleteComment.success(preData));
  } catch (err) {
    dispatch(deleteComment.failure(err));
    throw err;
  }
}

export const asyncUpdateComment = (payload) => async (dispatch) => {
  const { commentId, content } = payload;
  try {
    const { data: comment } = await updateCommentRequest({
      id: commentId,
      content,
    });
    const normalized = normalize(comment, commentSchema);
    dispatch(
      updateComment.success({
        ...payload,
        bundleEntities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(
      updateComment.failure({
        ...payload,
        data: err,
      }),
    );
    throw err;
  }
}

export const asyncGetCommentTree = (payload) => async (dispatch, getState) => {
  const { entityType, entityId, next, excepts = [] } = payload;
  const bundleState = selectCommentBundle(getState(), payload)
  if (bundleState.isFetchingComments) {
    return;
  }
  try {
    dispatch(getCommentTree.request({ entityType, entityId }));
    const params = {
      entity_type: entityType,
      entity_id: entityId,
      excepts,
    };
    if (next) {
      params.page_size = next.page_size;
      params.page = next.page;
    }
    const { data, meta, pagination } = await getCommentsRequest(params);
    const normalized = normalize(data, [commentSchema]);
    let formatedPagniation;
    if (pagination) {
      formatedPagniation = {
        total_count: pagination.total_count,
        next: pagination.next ? {
          page: pagination.next,
          page_size: pagination.page_size,
        } : null,
      };
    } else {
      formatedPagniation = {
        total_count: meta.total,
      }
    }
    dispatch(
      getCommentTree.success({
        entityType,
        entityId,
        list: normalized.result,
        bundleEntities: normalized.entities,
        pagination: formatedPagniation,
      }),
    );
  } catch (err) {
    dispatch(getCommentTree.failure({
      entityType,
      entityId,
      data: err,
    }));
    throw err;
  } finally {
    dispatch(
      getCommentTree.fulfill({
        entityType,
        entityId,
      }),
    );
  }
}