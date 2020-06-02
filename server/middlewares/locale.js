const { readFileSync } = require('fs');
const Sentry = require('@sentry/node');
const cache = require('../services/cache');
const request = require('../services/request');
const localeDataCache = new Map();

const { SERVER_SENTRY_DSN } = process.env;

const getLocaleDataScript = (locale) => {
  const lang = locale.split('-')[0];
  if (!localeDataCache.has(lang)) {
    const localeDataFile = require.resolve(`react-intl/locale-data/${lang}`);
    const localeDataScript = readFileSync(localeDataFile, 'utf8');
    localeDataCache.set(lang, localeDataScript);
  }
  return localeDataCache.get(lang);
};

const firstUndefined = (arr, maxIndex, index = 0) => {
  if (index > maxIndex) {
    return undefined;
  }
  return arr[index] || firstUndefined(arr, maxIndex, index + 1);
};

const getLocale = (acceptStr = '', options) => {
  if (SERVER_SENTRY_DSN) {
    Sentry.setExtra('localeStr', acceptStr);
  }
  const accepts = acceptStr.split(',').map((item) => item.split(';')[0]);
  const matched = [];
  const exactMatched = options.find((option) => {
    const acceptIndex = accepts.findIndex(
      (a) => a.toLowerCase() === option.locale.toLowerCase(),
    );
    if (acceptIndex > -1) {
      matched[acceptIndex] = option;
    }
    if (acceptIndex === 0) {
      return true;
    }
    return false;
  });
  if (exactMatched) {
    return exactMatched;
  }
  if (SERVER_SENTRY_DSN && acceptStr) {
    Sentry.captureMessage('LOCALE_NOT_MATCHED');
  }
  // TODO: if just contain language-info, get region based on ip address
  return (
    firstUndefined(matched, accepts.length) || {
      locale: 'zh-CN',
      label: '中文（中国）',
      label_region: '中国大陆',
    }
  );
};

module.exports = async (req, res, next) => {
  const userMeta = req.user
    ? await cache.get(`user-meta:${req.user.uid}`)
    : null;
  if (userMeta) {
    req.locale = userMeta.locale;
    req.localeLabel = userMeta.locale_label;
    req.localeRegion = userMeta.locale_region;
  } else {
    // detect or cookie;
    const locales = await cache.remember(`locales`, undefined, async () => {
      const { data } = await request({
        url: '/api/language-locale/',
      });
      return data;
    });
    const locale = getLocale(
      req.headers['X-Language-Locale'] ||
        req.cookies.locale ||
        req.headers['accept-language'],
      locales,
    );
    req.locale = locale.locale;
    req.localeLabel = locale.label;
    req.localeRegion = locale.label_region;
  }

  req.localeDataScript = getLocaleDataScript(req.locale);

  if (!req.cookies.locale || req.cookies.locale !== req.locale) {
    res
      .cookie('locale', req.locale)
      .cookie('localeLabel', req.localeLabel)
      .cookie('localeRegion', req.localeRegion);
  } else if (req.cookies.localeLabel !== req.localeLabel) {
    res.cookie('localeLabel', req.localeLabel);
  } else if (req.cookies.localeRegion !== req.localeRegion) {
    res.cookie('localeRegion', req.localeRegion);
  }

  next();
};
