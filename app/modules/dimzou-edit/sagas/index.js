import { fork } from 'redux-saga/effects';

import bundleSaga from './bundle';
import nodeSaga from './node';
import commentSaga from './comment';

export default function* dimzouEditSaga() {
  yield fork(bundleSaga);
  yield fork(nodeSaga);
  yield fork(commentSaga);
}
