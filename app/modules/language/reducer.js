/*
 *
 * LanguageProvider reducer
 *
 */

import { handleActions } from 'redux-actions';
import update from 'immutability-helper';

import { DEFAULT_LOCALE, DEFAULT_LOCALE_LABEL } from './constants';

import {
  changeLocale,
  loadTranslations,
  fetchTranslations,
  fetchLanguages,
  submitTranslation,
  enableTranslationMode,
  disableTranslationMode,
  openLanguageSelect,
  closeLanguageSelect,
  openTranslateLanguageSelect,
  closeTranslateLanguageSelect,
  fetchLocales,
  createLocale,
  setLocale,
} from './actions';

const initialState = {
  locale: DEFAULT_LOCALE,
  localeLabel: DEFAULT_LOCALE_LABEL,
  translations: {},
  userTranslations: {},
  fetching: {},
  fetched: {},
  locales: undefined,
  fetchingLocales: false,
  localesFetched: false,
  languages: undefined,
  fetchingLanguages: false,
  languagesFetched: false,

  translateLocale: undefined,
  translateLocaleLabel: undefined,

  isTranslateModeEnabled: false,
  isTranslateLanguageSelectOpened: false,
  isLocaleSelectModalOpened: false,
};

const languageReducer = handleActions(
  {
    [setLocale]: (state, action) => ({
      ...state,
      locale: action.payload.locale,
      localeLabel: action.payload.localeLabel,
      localeRegion: action.payload.localeRegion,
    }),
    [changeLocale]: (state, action) => ({
      ...state,
      locale: action.payload.locale,
      localeLabel: action.payload.localeLabel,
      localeRegion: action.payload.localeRegion,
      isLocaleSelectModalOpened: false, // TODO: isLocaleSelectModalOpened --> isLocaleModalOpened
    }),
    [loadTranslations]: (state, action) =>
      update(state, {
        translations: {
          [action.payload.locale]: {
            $set: action.payload.translations,
          },
        },
        userTranslations: {
          [action.payload.locale]: {
            $set: action.payload.userTranslations,
          },
        },
      }),
    [fetchTranslations.REQUEST]: (state, action) =>
      update(state, {
        fetching: {
          [action.payload.locale]: { $set: true },
        },
      }),
    [fetchTranslations.SUCCESS]: (state, action) => {
      const { locale, date, translations, userTranslations } = action.payload;
      return update(state, {
        fetched: {
          [locale]: { $set: date },
        },
        fetching: {
          [locale]: { $set: false },
        },
        translations: {
          [locale]: { $set: translations },
        },
        userTranslations: {
          [locale]: { $set: userTranslations },
        },
      });
    },
    [fetchTranslations.FAILURE]: (state, action) =>
      update(state, {
        fetching: {
          [action.payload.locale]: false,
        },
      }),
    [fetchLanguages.REQUEST]: (state) => ({
      ...state,
      fetchingLanguages: true,
    }),
    [fetchLanguages.SUCCESS]: (state, action) => ({
      ...state,
      languages: action.payload,
      languagesFetched: true,
    }),
    [fetchLanguages.FULFILL]: (state) => ({
      ...state,
      fetchingLanguages: false,
    }),
    [fetchLocales.REQUEST]: (state) => ({
      ...state,
      fetchingLocales: true,
    }),
    [fetchLocales.SUCCESS]: (state, action) => ({
      ...state,
      locales: action.payload,
      localesFetched: true,
    }),
    [fetchLocales.FULFILL]: (state) => ({
      ...state,
      fetchingLocales: false,
    }),
    [createLocale.SUCCESS]: (state, action) =>
      update(state, {
        locales: (list = []) => [...list, action.payload],
      }),
    [submitTranslation.SUCCESS]: (state, action) =>
      update(state, {
        userTranslations: {
          [action.payload.locale]: (map = {}) => ({
            ...map,
            [action.payload.key]: action.payload.translation,
          }),
        },
        fetched: {
          [action.payload.locale]: {
            $set: action.payload.date,
          },
        },
      }),
    [enableTranslationMode]: (state, action) => ({
      ...state,
      isTranslateModeEnabled: true,
      isTranslateLanguageSelectOpened: false,
      translateLocale: action.payload.locale,
      translateLocaleLabel: action.payload.label,
    }),
    [disableTranslationMode]: (state) => ({
      ...state,
      isTranslateModeEnabled: false,
      translateLocale: undefined,
      translateLocaleLabel: undefined,
    }),
    [openTranslateLanguageSelect]: (state) => ({
      ...state,
      isTranslateLanguageSelectOpened: true,
    }),
    [closeTranslateLanguageSelect]: (state) => ({
      ...state,
      isTranslateLanguageSelectOpened: false,
    }),
    [openLanguageSelect]: (state) => ({
      ...state,
      isLocaleSelectModalOpened: true,
    }),
    [closeLanguageSelect]: (state) => ({
      ...state,
      isLocaleSelectModalOpened: false,
    }),
  },
  initialState,
);

export const REDUCER_KEY = 'language';

export default languageReducer;
