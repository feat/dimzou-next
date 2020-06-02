import { call, put, takeEvery, select } from 'redux-saga/effects';
import { normalize } from 'normalizr';

import { rewordingComment as rewordingCommentSchema } from '@/schema';
import ApiError from '@/errors/ApiError';

import notification from '@feat/feat-ui/lib/notification';

import {
  removeRewordingComment,
  receiveRewordingComment,
  receiveUpdatedRewordingComment,
  fetchRewordingCommentTree,
  increaseRootCount,
  decreaseRootCount,
  initRewordingCommentBundle,
} from '../actions';

import {
  getRewordingCommentList as getCommentListRequest,
  getRewordingComment as getCommentRequest,
} from '../requests';

import { selectRewordingCommentBundle, commentHasLoaded } from '../selectors';

function* getRewordingCommentsAsync(action) {
  const { nodeId, rewordingId, next = { page_size: 5 } } = action.payload;
  yield put(fetchRewordingCommentTree.request({ nodeId, rewordingId }));
  try {
    const { data, pagination } = yield call(getCommentListRequest, {
      node_id: nodeId,
      rewording_id: rewordingId,
      page_size: next.page_size,
      page: next.page,
    });
    const normalized = normalize(data, [rewordingCommentSchema]);
    yield put(
      fetchRewordingCommentTree.success({
        nodeId,
        rewordingId,
        list: normalized.result,
        hasMore: data.length >= next.page_size,
        bundleEntities: normalized.entities,
        pagination,
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(
      fetchRewordingCommentTree.failure({
        nodeId,
        rewordingId,
        error: err,
      }),
    );
  }
}


export function* tryToFetchNewComment(action) {
  const {
    nodeId,
    data: { object_id: rewordingId, parent_id: parentId, id: commentId },
  } = action.payload;
  const isLoaded = yield select((state) =>
    commentHasLoaded(state, { rewordingId, commentId }),
  );
  if (isLoaded) {
    return;
  }
  const commentBundleState = yield select((state) =>
    selectRewordingCommentBundle(state, { rewordingId }),
  );

  if (commentBundleState && commentBundleState.isInitialized) {
    // fetch comment an ...
    try {
      let comment
      if (action.payload.data && action.payload.data.content && action.payload.data.user) {
        comment = action.payload.data;
      } else {
        const res = yield call(getCommentRequest, {
          node_id: nodeId,
          id: commentId,
        });
        comment = res.data;
      }

      const normalized = normalize(comment, rewordingCommentSchema);
      const data = {
        nodeId,
        rewordingId,
        parentId,
        commentId: comment.id,
        bundleEntities: normalized.entities,
      };
      yield put(receiveRewordingComment(data));
    } catch (err) {
      notification.error({
        message: 'Error',
        description: err.message,
      });
      if (!(err instanceof ApiError)) {
        logging.error(err);
      }
    }
  } else if (!parentId) {
    // update rewording comment count;
    yield put(increaseRootCount({ rewordingId }));
  }
}

export function* tryToFetchUpdatedComment(action) {
  // check init;
  const {
    nodeId,
    data: { id: commentId, object_id: rewordingId, parent_id: parentId },
  } = action.payload;
  const commentBundleState = yield select((state) =>
    selectRewordingCommentBundle(state, { rewordingId }),
  );
  if (!commentBundleState || !commentBundleState.isInitialized) {
    return;
  }
  try {
    let comment
    if (action.payload.data && action.payload.data.content && action.payload.data.user) {
      comment = action.payload.data;
    } else {
      const res = yield call(getCommentRequest, {
        node_id: nodeId,
        id: commentId,
      });
      comment = res.data;
    }
    const normalized = normalize(comment, rewordingCommentSchema);
    yield put(
      receiveUpdatedRewordingComment({
        rewordingId,
        commentId,
        parentId,
        bundleEntities: normalized.entities,
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
  }
}

export function* handleCommentDeleted(action) {
  const {
    nodeId,
    data: { id: commentId, object_id: rewordingId, parent_id: parentId },
  } = action.payload;

  const commentBundleState = yield select((state) =>
    selectRewordingCommentBundle(state, { rewordingId }),
  );

  if (commentBundleState && commentBundleState.isInitialized) {
    yield put(
      removeRewordingComment({
        commentId,
        parentId,
        rewordingId,
      }),
    );
  } else {
    yield put(
      decreaseRootCount({
        rewordingId,
        nodeId,
      }),
    );
  }
}

function* initCommentBundleFlow(action) {
  const { payload } = action;
  const bundleState = yield select((state) =>
    selectRewordingCommentBundle(state, payload),
  );
  if (bundleState.rootCount && !bundleState.comments.length) {
    yield put(fetchRewordingCommentTree(payload));
  }
}

export default function* commentSaga() {
  yield takeEvery(initRewordingCommentBundle, initCommentBundleFlow);
  yield takeEvery(fetchRewordingCommentTree, getRewordingCommentsAsync);
}
