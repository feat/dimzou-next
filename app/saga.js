import { fork, call, spawn, takeEvery, select } from 'redux-saga/effects';


import languageService from './modules/language/saga';

import commentService from './modules/comment/saga';
import likeService from './modules/like/saga';

function* loadUserIndependentServices() {
  yield fork(commentService);
  yield fork(likeService);
  // yield fork(loadAdvertiseService);
  yield fork(languageService);
}


export default function* appSaga() {
  yield fork(loadUserIndependentServices);
}
