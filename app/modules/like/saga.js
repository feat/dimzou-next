import { eventChannel } from 'redux-saga';
import { takeEvery, call, put, fork, take, select } from 'redux-saga/effects';
import { normalize } from 'normalizr';

import { selectCurrentUserId } from '@/modules/auth/selectors';
import { like as likeRequest, unlike as unlikeRequest } from '@/client/like';
import { like as likeSchema } from '@/schema';

import message from '@feat/feat-ui/lib/message';

import { initWidget, createLike, deleteLike, likeSignal } from './actions';
import { CHANNEL_OBJECT_TYPE_MAP } from './constants';
import likeSocket from '../comment/socket';

function* initWidgetFlow(action) {
  const { payload } = action;
  if (payload.channel) {
    likeSocket.private(payload.channel);
  }
}

function* createLikeAsync(action) {
  const { entityType, entityId } = action.payload;
  try {
    const res = yield call(likeRequest, {
      target_type: entityType,
      object_id: entityId,
    });
    const normalized = normalize(res.data, likeSchema);
    yield put(
      createLike.success({
        entityType,
        entityId,
        id: normalized.result,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    message.error(err.message);
    yield put(
      createLike.failure({
        entityType,
        entityId,
        data: err,
      }),
    );
  }
}

function* deleteLikeAsync(action) {
  const { entityType, entityId } = action.payload;
  try {
    const res = yield call(unlikeRequest, {
      target_type: entityType,
      object_id: entityId,
    });

    yield put(
      deleteLike.success({
        entityType,
        entityId,
        id: res.data.id,
      }),
    );
  } catch (err) {
    message.error(err.message);
    yield put(
      deleteLike.failure({
        ...action.payload,
        data: err,
      }),
    );
  }
}

function* listenLikeSocket() {
  const currentUserId = yield select(selectCurrentUserId);
  const channel = eventChannel((emitter) => {
    likeSocket.open();
    likeSocket.on('activity.like-signal', (_, msg) => {
      const {
        status,
        object_id: objectId,
        like_object_type: objectType,
        task_id,
        ...like
      } = msg;
      // TODO: may normalize like object,
      const payload = {
        status,
        entityType: CHANNEL_OBJECT_TYPE_MAP[objectType],
        entityId: objectId,
        id: like.id,
        updated_at: like.updated_at,
        isCurrentUserLike: like.user.uid === currentUserId,
        like,
      };
      emitter(likeSignal(payload));
    });

    return () => {
      likeSocket.close();
    };
  });
  try {
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  } finally {
    channel.close();
  }
}

export default function* watchLike() {
  // public
  yield fork(listenLikeSocket);
  // auth requried
  yield takeEvery(initWidget, initWidgetFlow);
  yield takeEvery(createLike.TRIGGER, createLikeAsync);
  yield takeEvery(deleteLike.TRIGGER, deleteLikeAsync);
}
