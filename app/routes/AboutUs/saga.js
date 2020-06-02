import { takeEvery, call, put, select } from 'redux-saga/effects';
import {
  fetchInfo as fetchInfoRequest,
  fethGroupInfo as fetchGroupInfoRequest,
  fetchPost as fetchPostRequest,
  fetchFeatMenu as fetchFeatMenuRequest,
} from './requests';

import { fetchData } from './actions';
import { selectPageState } from './selectors';

function* fetchDataAsync() {
  const pageState = yield select(selectPageState);
  if (pageState.loading) {
    return;
  }
  try {
    yield put(fetchData.request());
    const { data: menuInfo } = yield call(fetchFeatMenuRequest);
    const infoItem = menuInfo.items.find(
      (item) => item.label === 'menu.feat.info',
    );
    const postItem = menuInfo.items.find(
      (item) => item.label === 'menu.feat.post',
    );
    const groupItem = menuInfo.items.find(
      (item) => item.label === 'menu.feat.group',
    );

    let info;
    let post;
    let group;
    if (infoItem) {
      info = yield call(fetchInfoRequest, infoItem.resource);
    }
    if (postItem) {
      post = yield call(fetchPostRequest, postItem.resource);
    }
    if (groupItem) {
      group = yield call(fetchGroupInfoRequest, groupItem.resource);
    }
    yield put(
      fetchData.success({
        info,
        group,
        post,
      }),
    );
  } catch (err) {
    if (typeof logging === 'object') {
      logging.error(err);
    }
    yield put(fetchData.failure(err));
  } finally {
    yield put(fetchData.fulfill());
  }
}

export default function* aboutUs() {
  yield takeEvery(fetchData, fetchDataAsync);
}
