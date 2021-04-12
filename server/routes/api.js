const proxy = require('http-proxy-middleware');
// var passport = require('passport')
const debug = require('../services/debug');
const cache = require('../services/cache');

// TODO make another worker to reset redis cache.
const apiProxy = proxy('/api', {
  target: process.env.API_ENDPOINT,
  secure: false,
  // xfwd: true, // handle by nginx
  logProvider: () => ({
    log: debug.apiProxy,
    debug: debug.apiProxy,
    info: debug.apiProxy,
    warn: debug.apiProxy,
    error: debug.apiProxy,
  }),
  onProxyReq: (proxyReq, req) => {
    const apiHeaders = req.getApiHeaders();
    // debug(req.headers)
    // debug(req.connection.remoteAddress)
    Object.entries(apiHeaders).forEach(([key, value]) => {
      // console.log(key, value);
      proxyReq.setHeader(key, value);
    });
  },
  onProxyRes: (proxyRes, req) => {
    if (
      req.method.toUpperCase() === 'POST' &&
      (req.url === '/api/user/user-security-question/' ||
        req.url === '/api/language-locale/set-language/' ||
        req.url === '/api/user/profile/orig_avatar/' ||
        req.url === '/api/user/profile/avatar/')
    ) {
      cache.forget(`user:${req.user.uid}`);
    } else if (
      req.method.toUpperCase() === 'PATCH' &&
      req.url === `/api/user/profile/${req.user.uid}/`
    ) {
      cache.forget(`user:${req.user.uid}`);
    }
    if (
      req.method.toUpperCase() === 'POST' &&
      req.url === '/api/dimzou/category/'
    ) {
      cache.forget(`categories:${req.user.uid}`);
    }
  },
});

module.exports = apiProxy;
