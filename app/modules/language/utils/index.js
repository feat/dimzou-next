import Cookies from 'js-cookie';

import storage from '@/utils/storage';

import {
  CUSTOM_LOCALE_FALLBACK,
  CUSTOM_LOCALE_PREFIX,
  DEFAULT_LOCALE,
  DEFAULT_LOCALE_LABEL,
} from '../constants';

const getUserIdentity = () => undefined;

export const getLanguageCode = (locale) => {
  let langCode = locale.split('-')[0];
  if (langCode === CUSTOM_LOCALE_PREFIX) {
    langCode = CUSTOM_LOCALE_FALLBACK;
  }
  return langCode;
};

export function withFallbackLocale(locale) {
  if (locale.split('-')[0] === CUSTOM_LOCALE_PREFIX) {
    return CUSTOM_LOCALE_FALLBACK;
  }
  return locale;
}

function getCacheKey() {
  const identity = getUserIdentity();
  const cacheKey = identity ? `${identity}.locale` : '_locale';
  return cacheKey;
}

function getTranslationCacheKey(locale) {
  const cacheKey = `${locale}_translations`;
  return cacheKey;
}

function getUserTranslationCacheKey(locale, identity) {
  return `${locale}_transaltions:${identity}`;
}

export function getCachedLocaleData() {
  const cacheKey = getCacheKey();
  const cacheConfig = storage.getItem(cacheKey);
  if (cacheConfig) {
    try {
      const cachedInfo = JSON.parse(cacheConfig);
      /** UPDATE_CODE */
      if (cachedInfo.languageName) {
        storage.setItem(
          cacheKey,
          JSON.stringify({
            locale: cachedInfo.locale,
            localeLabel: cachedInfo.languageName,
          }),
        );
      }
      return cachedInfo;
    } catch (err) {
      return undefined;
    }
  } else {
    const locale = Cookies.get('locale') || DEFAULT_LOCALE;
    let localeLabel = Cookies.get('localeLabel');
    if (!localeLabel && locale === DEFAULT_LOCALE) {
      localeLabel = DEFAULT_LOCALE_LABEL;
    } else if (!localeLabel) {
      localeLabel = locale;
    }
    return {
      locale,
      localeLabel,
    };
  }
}

export function setCachedLocaleData(data) {
  const cacheKey = getCacheKey();
  // set up cookie
  Cookies.set('locale', data.locale);
  Cookies.set('localeLabel', data.localeLabel);
  Cookies.set('localeRegion', data.localeRegion);
  return storage.setItem(cacheKey, JSON.stringify(data));
}

export function getCachedTranslations(locale, userIdentity) {
  const cacheKey = getTranslationCacheKey(locale);
  const userCachedKey = getUserTranslationCacheKey(locale, userIdentity);
  let translations;
  let userTranslations;
  try {
    translations = JSON.parse(storage.getItem(cacheKey));
  } catch (err) {
    logging.error(err);
  }
  try {
    userTranslations = JSON.parse(storage.getItem(userCachedKey));
  } catch (err) {
    logging.error(err);
  }
  return {
    translations: translations || {},
    userTranslations: userTranslations || {},
  };
}

export function setCachedTranslations(data, locale, userIdentity) {
  const cacheKey = getTranslationCacheKey(locale);
  storage.setItem(cacheKey, JSON.stringify(data.translations));
  if (userIdentity && data.userTranslations) {
    const userCachedKey = getUserTranslationCacheKey(locale, userIdentity);
    storage.setItem(userCachedKey, JSON.stringify(data.userTranslations));
  }
}
