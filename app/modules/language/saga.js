import {
  fork,
  select,
  call,
  put,
  take,
  cancel,
  takeEvery,
  takeLatest,
  all,
} from 'redux-saga/effects';
import get from 'lodash/get';
import { addLocaleData } from 'react-intl';

import ApiError from '@/errors/ApiError';
import { selectCurrentUser, hasAuthedUser } from '@/modules/auth/selectors';
import { instance } from '@/utils/request';

import {
  fetchLanguages as fetchLanguagesRequest,
  fetchPublicTranslations as fetchPublicTranslationsRequest,
  // fetchCustomTranslations as fetchCustomTranslationsRequest,
  submitTranslation as submitTranslationRequest,
  setUserLocale as setUserLocaleRequest,
} from '@/client/language';

import notification from '@feat/feat-ui/lib/notification';

import { selectCurrentLocale } from './selectors';

import {
  CHANGE_LOCALE,
  fetchTranslations,
  fetchLanguages,
  enableTranslationMode,
  disableTranslationMode,
  submitTranslation,
  SET_LOCALE,
} from './actions';
import { REDUCER_KEY } from './reducer';
import {
  getLanguageCode,
  setCachedLocaleData,
  getCachedTranslations,
  setCachedTranslations,
} from './utils';

export function* tryToFetchTranslations({ locale, fallback }) {
  // fetch locale data;
  const languageState = yield select((state) => state[REDUCER_KEY]);
  const fetched = get(languageState, ['fetched', locale]);
  const fetching = get(languageState, ['fetching', locale]);
  if (fetched || fetching) {
    return;
  }
  yield put(fetchTranslations.request({ locale }));
  try {
    const res = yield call(fetchPublicTranslationsRequest, {
      locale,
      fallback,
    });
    yield put(
      fetchTranslations.success({
        locale,
        translations: res.data,
        date: Date.now(),
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
      fetchTranslations.failure({
        locale,
        data: err,
      }),
    );
  }
}

export function* fetchTranslationsAsync(action) {
  const { locale, fallback } = action.payload;
  yield put(fetchTranslations.request({ locale }));
  try {
    const res = yield call(fetchPublicTranslationsRequest, {
      locale,
      fallback,
    });
    yield put(
      fetchTranslations.success({
        locale,
        translations: res.data,
        date: Date.now(),
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
      fetchTranslations.failure({
        locale,
      }),
    );
  }
}

function importIntl(locale) {
  const language = getLanguageCode(locale);
  return import('intl')
    .then(() => import(`intl/locale-data/jsonp/${language}`))
    .catch((err) => {
      logging.error(err);
    });
}

function loadLocaleData(locale) {
  const language = getLanguageCode(locale);

  return import(`react-intl/locale-data/${language}`)
    .then((data) => {
      addLocaleData(data.default);
    })
    .catch((err) => {
      logging.error(err);
    });
}

function* setLocaleSaga(action) {
  const { locale } = action.payload;
  if (typeof window !== 'object') {
    // should handle in browser
    return;
  }
  if (!window.Intl) {
    yield call(importIntl, locale);
  }
  yield call(loadLocaleData, locale);
  const currentUser = yield select(selectCurrentUser);
  const userIdentity = currentUser.uid;

  const cachedTransaltions = getCachedTranslations(locale, userIdentity);

  try {
    const promises = [];

    promises.push(
      instance({
        url: `/api/ui-translation/public/`,
        method: 'GET',
        headers: {
          'If-Modified-Since': get(
            cachedTransaltions,
            'translations.lastModified',
            undefined,
          ),
        },
        params: { locale },
      }).catch((err) => err.response),
    );

    if (currentUser) {
      promises.push(
        instance({
          url: `/api/ui-translation/custom/`,
          method: 'GET',
          headers: {
            'If-Modified-Since': get(
              cachedTransaltions,
              'userTranslations.lastModified',
              undefined,
            ),
          },
          params: { locale },
        }).catch((err) => err.response),
      );
    }

    const [pubRes, cusRes] = yield all(promises);
    const transData = {};

    if (pubRes) {
      if (pubRes.status === 304) {
        transData.translations = get(
          cachedTransaltions,
          'translations.data',
          {},
        );
      } else {
        cachedTransaltions.translations = {
          data: pubRes.data.data,
          lastModified: pubRes.headers['last-modified'],
        };
        transData.translations = pubRes.data.data;
      }
    }
    if (cusRes) {
      if (cusRes.status === 304) {
        transData.userTranslations = get(
          cachedTransaltions,
          'userTranslations.data',
          {},
        );
      } else {
        cachedTransaltions.userTranslations = {
          data: cusRes.data.data,
          lastModified: cusRes.headers['last-modified'],
        };
        transData.userTranslations = cusRes.data.data;
      }
    }
    setCachedTranslations(cachedTransaltions, locale, userIdentity);
    yield put(
      fetchTranslations.success({
        locale,
        ...transData,
        date: Date.now(),
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
      fetchTranslations.failure({
        locale,
      }),
    );
  }
}

function* changeLocaleSaga(action) {
  const {
    payload: { forceRefresh, ...data },
  } = action;
  const hasAuthed = yield select(hasAuthedUser);
  if (hasAuthed) {
    try {
      yield call(setUserLocaleRequest, data);
    } catch (err) {
      notification.error({
        message: 'Error',
        description: err.message,
      });
      if (!(err instanceof ApiError)) {
        logging.error(err);
      }
    }
  } else {
    setCachedLocaleData(data);
  }
  if (forceRefresh) {
    window.location.reload();
  }
}

function* fetchLanguagesAsync() {
  // const languageState = yield select(state => selectLocaleState(action.payload.locale));
  yield put(fetchLanguages.request());
  try {
    const res = yield call(fetchLanguagesRequest);
    yield put(fetchLanguages.success(res.data));
  } catch (err) {
    yield put(fetchLanguages.failure(err));
  }
  yield put(fetchLanguages.fulfill());
}

function* submitTranslationAsync(action) {
  yield put(submitTranslation.request(action.payload));
  try {
    const res = yield call(submitTranslationRequest, action.payload);
    notification.success({
      content: 'Translation Submitted',
    });
    yield put(
      submitTranslation.success({
        ...res.data,
        key: action.payload.key,
        date: Date.now(),
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Failed To Submit Translation',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
  }
}

function* watchSubmitTranslation() {
  yield takeEvery(submitTranslation.TRIGGER, submitTranslationAsync);
}

function* hackSlickAttribute() {
  const sliders = document.querySelectorAll('.slick-slider');
  Array.prototype.forEach.call(sliders, (slider) => {
    /* eslint-disable */
    slider.style.webkitUserSelect = 'initial';
    /* eslint-enable */
  });
}

function* initTranslateService(action) {
  yield fork(tryToFetchTranslations, {
    locale: action.payload.locale,
    fallback: false,
  });
  const watchSubmit = yield fork(watchSubmitTranslation);
  yield fork(hackSlickAttribute);
  yield take(disableTranslationMode.toString());
  yield cancel(watchSubmit);
}

export function* fetchCurrentLocaleTranslations() {
  const locale = yield select((state) => selectCurrentLocale(state));
  yield put(fetchTranslations({ locale, fallback: true }));
}

export default function* languageService() {
  yield takeLatest(SET_LOCALE, setLocaleSaga);
  yield takeLatest(CHANGE_LOCALE, changeLocaleSaga);
  yield takeEvery(fetchLanguages.TRIGGER, fetchLanguagesAsync);
  yield takeEvery(fetchTranslations.TRIGGER, fetchTranslationsAsync);
  yield takeEvery(enableTranslationMode.toString(), initTranslateService);
}
