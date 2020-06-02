import { createSelector, createStructuredSelector } from 'reselect';
import get from 'lodash/get';
import { hasAuthedUser } from '@/modules/auth/selectors';

import { REDUCER_KEY } from './reducer';
/**
 * Direct selector to the languageToggle state domain
 */
const selectLanguageDomain = (state) => state[REDUCER_KEY];

export const selectMessages = createSelector(
  selectLanguageDomain,
  (languageState) => {
    const { locale } = languageState;
    const translations = get(languageState, ['translations', locale]);
    const userTranslations = get(languageState, ['userTranslations', locale]);
    if (!translations) {
      return null;
    }
    if (!userTranslations) {
      return translations;
    }

    return {
      ...translations,
      ...userTranslations,
    };
  },
);

export const selectLastUpdatedAt = (state) => {
  const subState = selectLanguageDomain(state);
  return get(subState, ['fetched', subState.locale]);
};

const selectTargetLanguageMessages = createSelector(
  (state, props) => {
    const subState = selectLanguageDomain(state);
    return get(subState, ['translations', props.targetLocale]);
  },
  (state, props) => {
    const subState = selectLanguageDomain(state);
    return get(subState, ['userTranslations', props.targetLocale]);
  },
  (translations, userTranslations) => ({
    ...translations,
    userTranslations,
  }),
);

export const selectCurrentLocale = createSelector(
  selectLanguageDomain,
  (state) => state.locale,
);

export const isTranslateModeEnabled = createSelector(
  selectLanguageDomain,
  (state) => state.isTranslateModeEnabled,
);

export const makeSelectTranslation = () =>
  createSelector(
    selectMessages,
    (_, props) => props.id,
    (messages, id) => messages[id],
  );

export const makeSelectTargetTranslation = () =>
  createSelector(
    selectTargetLanguageMessages,
    (_, props) => props.id,
    (messages, id) => messages[id],
  );

export const selectLocales = (state) => {
  const subState = selectLanguageDomain(state);
  return subState.locales;
};
export const selectLanguages = (state) => {
  const subState = selectLanguageDomain(state);
  return subState.languages;
};
export const isTargetTranslationReady = (state, props) => {
  const subState = selectLanguageDomain(state);
  return !!get(subState, ['fetched', props.targetLocale]);
};

export const selectTranslateLocale = (state) => {
  const subState = selectLanguageDomain(state);
  return subState.translateLocale;
};

export const selectTranslatableState = createStructuredSelector({
  isTranslateModeEnabled,
  locale: selectTranslateLocale,
  lastUpdatedAt: selectLastUpdatedAt,
});

export const isTranslateLanguageSelectOpened = (state) => {
  const subState = selectLanguageDomain(state);
  return subState.isTranslateLanguageSelectOpened;
};

export const selectTranslatableTriggerState = createStructuredSelector({
  isTranslateModeEnabled,
  isTranslateLanguageSelectOpened,
});

export const selectTranslatableModeHintInfo = createStructuredSelector({
  isTranslateModeEnabled,
  sourceLocale: (state) => {
    const subState = selectLanguageDomain(state);
    return subState.localeLabel;
  },
  targetLocale: (state) => {
    const subState = selectLanguageDomain(state);
    return subState.translateLocaleLabel;
  },
});

export const selectTranslateLanguageSelect = createStructuredSelector({
  canCreateLocale: hasAuthedUser,
  locales: selectLocales,
  isOpen: (state) => {
    const subState = selectLanguageDomain(state);
    return subState.isTranslateLanguageSelectOpened;
  },
  selectedLang: selectTranslateLocale,
});

export const selectLanguageSelect = createStructuredSelector({
  canCreateLocale: hasAuthedUser,
  locales: selectLocales,
  isOpen: (state) => {
    const subState = selectLanguageDomain(state);
    return subState.isLocaleSelectModalOpened;
  },
  selectedLang: (state) => {
    const subState = selectLanguageDomain(state);
    return subState.locale;
  },
});

export const selectLanguageSelectTrigger = createStructuredSelector({
  label: (state) => {
    const subState = selectLanguageDomain(state);
    return subState.localeLabel;
  },
  region: (state) => {
    const subState = selectLanguageDomain(state);
    return subState.localeRegion;
  },
  isOpen: (state) => {
    const subState = selectLanguageDomain(state);
    return subState.isLocaleSelectModalOpened;
  },
});

export const isFetchingLocales = (state) =>
  get(state, [REDUCER_KEY, 'fetchingLocales']);
