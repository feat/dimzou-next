/*
 *
 * LanguageProvider actions
 *
 */
import { createAction } from 'redux-actions';
import { createRoutine, promisifyRoutine } from 'redux-saga-routines';

import {
  fetchLocales as fetchLocalesRequest,
  createLocale as createLocaleRequest,
  // fetchLanguages as fetchLanguagesRequest,
  // fetchPublicTranslations as fetchPublicTranslationsRequest,
  // // fetchCustomTranslations as fetchCustomTranslationsRequest,
  // submitTranslation as submitTranslationRequest,
  // setUserLocale as setUserLocaleRequest,
} from '@/client/language';

import { isFetchingLocales } from './selectors';

// language
export const SET_LOCALE = 'LANGUAGE/SET_LOCALE';
export const CHANGE_LOCALE = 'LANGUAGE/CHANGE_LOCALE';
export const LOAD_TRANSLATIONS = 'LANGUAGE/LOAD_TRANSLATIONS';
export const RECEIVE_TRANSLATIONS = 'LANGUAGE/RECEIVE_TRANSLATIONS';
export const RECEIVE_USER_TRANSLATIONS = 'LANGUAGE/RECEIVE_USER_TRANSLATIONS';
export const FETCH_TRANSLATIONS = 'LANGUAGE/FETCH_TRANSLATIONS';
export const FETCH_LANGUAGES = 'LANGUAGE/FETCH_LANGUAGES';
export const FETCH_LOCALES = 'LANGUAGE/FETCH_LOCALES';
export const CREATE_LOCALE = 'LANGUAGE/CREATE_LOCALE';

export const OPEN_LANGUAGE_SELECT = 'LANGUAGE/OPEN_LANGUAGE_SELECT';
export const CLOSE_LANGUAGE_SELECT = 'LANGUAGE/CLOSE_LANGUAGE_SELECT';

// translatable
export const ENABLE_TRANSLATION_MODE = 'TRANSLATABLE/ENABLE_TRANSLATION_MODE';
export const DISABLE_TRANSLATION_MODE = 'TRANSLATABLE/DISABLE_TRANSLATION_MODE';
export const SUBMIT_TRANSLATION = 'TRANSLATABLE/SUBMIT_TRANSLATION';
export const OPEN_TRANSLATE_LANGUAGE_SELECT =
  'TRANSLATABLE/OPEN_TRANSLATE_LANGUAGE_SELECT';
export const CLOSE_TRANSLATE_LANGUAGE_SELECT =
  'TRANSLATABLE/CLOSE_TRANSLATE_LANGUAGE_SELECT';

// language
export const setLocale = createAction(SET_LOCALE);
export const changeLocale = createAction(CHANGE_LOCALE);
export const loadTranslations = createAction(LOAD_TRANSLATIONS);
export const receiveTranslations = createAction(RECEIVE_TRANSLATIONS);
export const receiveUserTranslations = createAction(RECEIVE_USER_TRANSLATIONS);
export const openLanguageSelect = createAction(OPEN_LANGUAGE_SELECT);
export const closeLanguageSelect = createAction(CLOSE_LANGUAGE_SELECT);

export const fetchTranslations = createRoutine(FETCH_TRANSLATIONS);
export const fetchLanguages = createRoutine(FETCH_LANGUAGES);
export const fetchLocales = createRoutine(FETCH_LOCALES);
export const createLocale = createRoutine(CREATE_LOCALE);
export const createLocalePromiseCreator = promisifyRoutine(createLocale);

// translatable
export const enableTranslationMode = createAction(ENABLE_TRANSLATION_MODE);
export const disableTranslationMode = createAction(DISABLE_TRANSLATION_MODE);
export const openTranslateLanguageSelect = createAction(
  OPEN_TRANSLATE_LANGUAGE_SELECT
);
export const closeTranslateLanguageSelect = createAction(
  CLOSE_TRANSLATE_LANGUAGE_SELECT
);
export const submitTranslation = createRoutine(SUBMIT_TRANSLATION);
export const submitTranslationPromiseCreator = promisifyRoutine(
  submitTranslation
);

// async actions
export const asyncFetchLocales = () => async (dispatch, getState) => {
  const fetchingLocales = isFetchingLocales(getState());
  if (fetchingLocales) {
    return;
  }
  dispatch(fetchLocales.request())
  try {
    const { data } = await fetchLocalesRequest()
    dispatch(fetchLocales.success(data));
  } catch (err) {
    dispatch(fetchLocales.failure(err));
    throw err;
  }
}

export const asyncCreateLocale = (payload) => async (dispatch) => {
  try {
    const res = await createLocaleRequest(payload)
    dispatch(createLocale.success(res));
  } catch (err) {
    dispatch(createLocale.failure(err));
    throw err;
  }
}