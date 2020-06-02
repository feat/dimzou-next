const jwtDecode = require('jwt-decode');
const qs = require('qs')
const Sentry = require('@sentry/node');
const api = require('../services/api')
const cache = require('../services/cache')
const redisClient = require('../services/redis')
const request = require('../services/request')
const debug = require('../services/debug')
const setTokenCookies = require('../utils/token-cookies')

const SECONDS_BEFORE_EXPIRED = 30;
const MAX_RETRIS = 10;

function refreshTokenRequest(token) {
  const data = {
    client_id: process.env.FEAT_CLIENT_ID,
    client_secret: process.env.FEAT_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: token,
  }
  const form = qs.stringify(data);

  return api.post('/api/o/token/', form, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((res) => res.data);
}

function releaseRefreshing(cacheKey) {
  redisClient.del(`refreshing_${cacheKey}`, (delErr, result) => {
    if (delErr) {
      debug.auth(delErr);
    } else if (result) {
      debug.auth('release refreshing');
    }
  });
}

function refreshToken(cacheKey, tokenInfo = {}, tries = 0) {
  return cache.get(cacheKey).then((data) => {
    if (tries > MAX_RETRIS) {
      releaseRefreshing(cacheKey);
      throw new Error('REFRESH_TOKEN_MAX_RETRIES_REACH');
    }
    if (data) {
      debug.auth('refreshed token from cache');
      return data;
    } 
    return new Promise((resolve, reject) => {
      redisClient.setnx(`refreshing_${cacheKey}`, 1, (err, reply) => {
        if (err) {
          reject(err);
        } else if (reply) {
          debug.auth('refreshing');
          refreshTokenRequest(tokenInfo.refresh_token).then((newData) => {
            cache.put(cacheKey, newData, 2).finally(() => {
              releaseRefreshing(cacheKey);
            });
            debug.auth(newData);
            resolve(newData);
          }).catch((reqErr) => {
            reject(reqErr);
            releaseRefreshing(cacheKey);
          }).finally(() => {
            debug.auth('refreshing fulfill');
          });
        } else {
          debug.auth('pending refreshing');
          setTimeout(() => refreshToken(cacheKey, tokenInfo, tries+1).then(resolve).catch(reject), 300);
        }
      })
    })
  })
}

function autoRefreshToken(tokenInfo, delta) {
  const tokenPayload = jwtDecode(tokenInfo.access_token);
  if ((Date.now() + delta * 1000) > tokenPayload.exp * 1000) {
  // if ((Date.now() - delta * 1000) > tokenPayload.iat * 1000) {
    const cacheKey = `api_token:${tokenPayload.sub}`;
    return refreshToken(cacheKey, tokenInfo);
  } 
  return Promise.resolve(tokenInfo);
  
}

module.exports = async (req, res, next) => {
  const { apiToken } = req.session;
  if (!apiToken) {
    next();
    return ;
  }
  try {
    const tokenInfo = await autoRefreshToken(apiToken, SECONDS_BEFORE_EXPIRED);
    if (tokenInfo !== apiToken) {
      req.session.apiToken = tokenInfo;
      setTokenCookies(res, tokenInfo.access_token);
    }
    const accessToken = tokenInfo.access_token;
    const tokenPayload = jwtDecode(accessToken);

    // set current user info;
    let user = await cache.get(`user:${tokenPayload.sub}`);
    if (user) {
      req.user = user;
      next();
      return;
    } 
    const apiRes = await request({
      url: '/api/user/basic-info/',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    debug(apiRes);
    user = apiRes.data;
    req.user = user;
    cache.put(`user:${user.uid}`, user);
    cache.put(`user-meta:${user.uid}`, apiRes.meta);
    next();
  } catch (err) {
    // reset apiToken;
    debug('AUTH ERROR');
    debug(err);
    Sentry.captureException(err);
    if (err.response && err.response.status === 401) {
      req.session.apiToken = null;
    }
    next();
  }
}
