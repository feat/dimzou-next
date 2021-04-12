import { take, race, delay, fork, put } from 'redux-saga/effects';

import { asyncFetchUsersBasic, fetchUserBasic } from './actions';

const IDLE_LOOP = 100000;

let usersToFetch = new Set();
let usersFetching;
let timeout = IDLE_LOOP;

function* fetchUsersBasic(userIds) {
  usersFetching = userIds;
  yield put(asyncFetchUsersBasic({ userIds: Array.from(userIds) }));
  usersFetching = null;
}

function* fetchBasicQueue() {
  while (true) {
    const { action } = yield race({
      action: take(fetchUserBasic.toString()),
      loop: delay(timeout),
    });
    if (action) {
      if (usersFetching && usersFetching.has(action.payload)) {
        continue;
      }
      usersToFetch.add(action.payload);
      timeout = 200;
      continue;
    }
    if (usersToFetch.size) {
      yield fork(fetchUsersBasic, usersToFetch);
      timeout = IDLE_LOOP;
      usersToFetch = new Set();
    }
  }
}

export default function* userService() {
  //   yield takeEvery(fetchUserBasic, queueUserRequest);
  yield fork(fetchBasicQueue);
}
