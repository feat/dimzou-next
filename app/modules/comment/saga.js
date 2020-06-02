import { eventChannel } from 'redux-saga';
import {
  call, put, select, takeEvery,
  all,
  take,
  fork,
} from 'redux-saga/effects';
import { normalize } from 'normalizr';
// import Notify from 'notifyjs';

import ApiError from '@/errors/ApiError';
import notification from '@feat/feat-ui/lib/notification';

// import { getText } from '@/utils/content';
// import { formatMessage } from '@/services/intl';

import {
  comment as commentSchema,
  // career as careerSchema,
  // education as educationSchema,
  // xfileEvent as xfileEventSchema,
  // dimzouPublication as publicationSchema,
} from '@/schema';

import {
  getComment as getCommentRequest,
} from '@/client/comment';

import commentSocket from './socket';
import {
  CHANNEL_OBJECT_TYPE_MAP,
  // COMMENTABLE_TYPE_ORDER,
  // COMMENTABLE_TYPE_CAREER,
  // COMMENTABLE_TYPE_EDUCATION,
  // COMMENTABLE_TYPE_EVENT,
  // COMMENTABLE_TYPE_PUBLICATION,
} from './constants';

// import { ENTITY_MAP } from 'schema';

import {
  registerBundle,
  bundleInitialized,
  receiveNewComment,
  receiveUpdatedComment,
  removeComment,
  commentSignal,
  asyncGetCommentTree,
} from './actions';

import { selectBundleComment, selectCommentBundle } from './selectors';

// import intlMessages from './messages';
import { REDUCER_KEY } from './reducers';

function* handleCommentSignal(action) {
  const { payload } = action;
  switch (payload.status) {
    case 'created':
      yield fork(tryToFetchNewComment, action);
      break;
    case 'updated':
      yield fork(tryToFetchUpdatedComment, action);
      break;
    case 'deleted':
      yield fork(handleCommentDeleted, action);
      break;
    default:
      logging.warn('UNKNOWN COMMENT SIGNAL', payload);
  }
}

function* tryToInitCommentBundle(action) {
  const { payload } = action;
  const bundleState = yield select((state) =>
    selectCommentBundle(state, payload),
  );
  if (
    (payload.rootCount === undefined || payload.rootCount > 0) &&
    bundleState.comments &&
    !bundleState.comments.length &&
    !bundleState.isFetchingComments
  ) {
    try {
      yield put(asyncGetCommentTree({
        entityType: payload.entityType,
        entityId: payload.entityId,
      }));
    } catch (err) {
      if (!(err instanceof ApiError)) {
        logging.error(err);
      }
    }
  }

  if (!bundleState.isInitialized) {
    yield put(bundleInitialized(payload));
  }
}

export function* tryToFetchNewComment(action) {
  const { payload } = action;
  const comment = yield select((state) =>
    selectBundleComment(state, {
      entityType: payload.entity_type,
      entityId: payload.entity_id,
      commentId: payload.id,
    }),
  );
  if (comment) {
    return;
  }

  try {
    let newComment = payload.comment;
    if (!newComment) {
      const res = yield call(getCommentRequest, payload.id);
      newComment = res.data;
    }
    const normalized = normalize(newComment, commentSchema);

    const data = {
      entityType: payload.entity_type,
      entityId: payload.entity_id,
      commentId: newComment.id,
      parentId: newComment.parent_id,
      bundleEntities: normalized.entities,
    };

    yield put(receiveNewComment(data));

    // const notice = new Notify(formatMessage(intlMessages.newCommentTitle), {
    //   body: getText(newComment.content),
    //   notifyClick: () => {
    //     const event = new CustomEvent('comment-message-clicked', {
    //       detail: data,
    //     })
    //     global.parent.focus();
    //     window.focus();
    //     window.dispatchEvent(event);
    //   },
    // });
    // notice.show();
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    })
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
  }
}

export function* tryToFetchUpdatedComment(action) {
  const { payload } = action;
  const comment = yield select((state) =>
    selectBundleComment(state, {
      entityType: payload.entity_type,
      entityId: payload.entity_id,
      commentId: payload.id,
    }),
  );
  if (comment && comment.last_modified === payload.last_modified) {
    return;
  }
  try {
    let updatedComment = payload.comment;
    if (!updatedComment) {
      const res = yield call(getCommentRequest, payload.id);
      updatedComment = res.data;
    }
    const normalized = normalize(updatedComment, commentSchema);
    yield put(
      receiveUpdatedComment({
        entityType: payload.entity_type,
        entityId: payload.entity_id,
        commentId: payload.id,
        parentId: payload.parent_id,
        bundleEntities: normalized.entities,
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    })
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
  }
}

export function* handleCommentDeleted(action) {
  const { payload } = action;
  const comment = yield select((state) =>
    selectBundleComment(state, {
      entityType: payload.entity_type,
      entityId: payload.entity_id,
      commentId: payload.id,
    }),
  );

  if (!comment) {
    return;
  }

  const data = {
    entityType: payload.entity_type,
    entityId: payload.entity_id,
    commentId: payload.id,
    parentId: payload.parent_id,
  };

  yield put(removeComment(data));
}


function* listenCommentSocket() {
  const channel = eventChannel((emitter) => {
    commentSocket.open();
    commentSocket.on('activity.comment-signal', (_, message) => {
      const { status, object_id: objectId, comment_object_type: objectType, task_id, ...comment } = message;
      const payload = {
        status,
        entity_type: CHANNEL_OBJECT_TYPE_MAP[objectType],
        entity_id: objectId,
        id: message.id,
        updated_at: message.updated_at,
        parent_id: message.parent_id,
        comment: comment.content ? comment : undefined,
      }
      emitter(commentSignal(payload))
    })

    return () => {
      commentSocket.close();
    }
  })
  try {
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  } finally {
    channel.close();
  }
}


export default function* commentService() {
  logging.debug('comment service')
  // public
  yield takeEvery(registerBundle, tryToInitCommentBundle);
  yield takeEvery(commentSignal, handleCommentSignal);
  yield fork(listenCommentSocket);

  // initialize registered bundle
  const registeredBundles = yield select((state) => state[REDUCER_KEY].bundles)
  yield all(Object.entries(registeredBundles).map(([key, bundleState]) => {
    if (!bundleState.isInitialized) {
      const [entityType, entityId] = key.split('_')
      const action = registerBundle({
        entityType,
        entityId,
        rootCount: bundleState.rootCount,
        channel: bundleState.channel,
        instanceKey: Object.keys(bundleState.instances)[0], // TODO: may have multi instance
      });
      return call(tryToInitCommentBundle, action)
    }
    return Promise.resolve()
  }))
}
