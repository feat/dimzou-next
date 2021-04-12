/* eslint-disable no-param-reassign */
const customConfig = require('./webpack.custom.config.js');

const withCustomResolve = (nextConfig = {}) => ({
  ...nextConfig,
  webpack(config, options) {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...customConfig.resolve.alias,
    };

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options);
    }

    return config;
  },
});

module.exports = withCustomResolve;
