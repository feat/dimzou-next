/* eslint-disable no-console */
const Sentry = require('@sentry/node');
const cache = require('../services/cache');
const request = require('../services/request');

const CACHE_TTL = process.env.CACHE_TTL || 30;

module.exports = async (req, res, next) => {
  const apiHeaders = req.getApiHeaders();
  let publicTranslations;
  let categories;
  let userTranslations;
  try {
    publicTranslations = await cache.remember(
      `public-translations:${req.locale}`, 
      CACHE_TTL, 
      async () => {
        const pubReq = await request({ url: '/api/ui-translation/public/', params: {
          locale: req.locale,
        }})
        return pubReq.data;
      });
  } catch (err) {
    Sentry.captureException(err);
    publicTranslations = {};
  }

  try {
    categories = await cache.remember(
      `categories:${req.user ? req.user.uid : 'anonymous'}`, 
      CACHE_TTL, 
      async () => {
        const { data } = await request({
          url: '/api/dimzou/category/my_category_list/',
          headers: apiHeaders,
        })
        return data;
      }
    )
  } catch (err) {
    Sentry.captureException(err);
    categories = [];
  }

  try {
    userTranslations = req.user ? await cache.remember(
      `user-translations:${req.user.uid},${req.locale}`, 
      CACHE_TTL, 
      async () => {
        const headers = { ...req.getApiHeaders() }
        delete headers['X-Language-Locale'];
        const { data } = await request({ 
          url: '/api/ui-translation/custom/', 
          params: {
            locale: req.locale,
          },
          headers,
        })
        return data;
      }
    ) : {};
  } catch (err) {
    Sentry.captureException(err);
    userTranslations = {};
  }

  const userMeta = req.user ? await cache.get(`user-meta:${req.user.uid}`, {}) : {};
  
  req.appContext = {
    publicTranslations,
    categories,
    userTranslations,
    userMeta,
  }

  next();
};
