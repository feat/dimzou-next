/* eslint-disable global-require */

/**
 * Front-end middleware
 */
module.exports = (app, options) => {
  const isProd = process.env.NODE_ENV === 'production';
  const isPlayground = process.env.PLAYGOURND;

  if (isProd) {
    const addProdMiddlewares = require('./addProdMiddlewares');
    addProdMiddlewares(app, options);
  } else if (isPlayground) {
    const webpackConfig = require('../../internals/webpack/webpack.playground.babel');
    const addDevMiddlewares = require('./addDevMiddlewares');
    addDevMiddlewares(app, webpackConfig);
  } else {
    const webpackConfig = require('../../internals/webpack/webpack.dev.babel');
    const addDevMiddlewares = require('./addDevMiddlewares');
    addDevMiddlewares(app, webpackConfig);
  }

  return app;
};
