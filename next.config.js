/* eslint-disable no-param-reassign */
const path = require('path');
// const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const withPlugins = require('next-compose-plugins');
const withSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'hidden-source-map',
});
const withTM = require('@weco/next-plugin-transpile-modules');
const withStyle = require('./next/withStyle');
const withOptimize = require('./next/withOptimize');
const extraWebpackConfig = require('./next/webpack.custom.config');

const appSrc = path.resolve(path.join(process.cwd(), 'app'));

// 此处使用 自定义 css 样式，是因为还没有准备好进行 css module 的迁移
module.exports = withPlugins(
  [withSourceMaps, withTM, withStyle, withOptimize],
  {
    distDir: 'build',
    generateBuildId: async () => process.env.RELEASE_TAG || 'preview',
    inlineImageLimit: 10240,
    assetPrefix: process.env.NEXT_ASSET_PREFIX || '',
    publicRuntimeConfig: {
      appName: process.env.APP_NAME,
      share: {
        facebook: {
          appId: process.env.FACEBOOK_APP_ID,
        },
        weibo: {
          appKey: process.env.WEIBO_APP_KEY,
        },
        twitter: {
          via: process.env.TWITTER_VIA,
        },
        host: process.env.HOST,
      },
      openwriterHost: process.env.OPENWRITER_HOST,
      sentryDsn: process.env.SENTRY_DSN,
      gaTrackingId: process.env.GA_TRACKING_ID,
    },
    env: {
      RELEASE_TAG: process.env.RELEASE_TAG || 'preview',
      BRANCH: process.env.CI_COMMIT_REF_NAME,
    },
    crossOrigin: 'anonymous',
    cssLoaderOptions: {
      ignoreOrder: true,
      sourceMap: true,
    },
    shouldUseSourceMap: true,
    paths: {
      appSrc,
    },
    sassOptions: {
      includePaths: [path.resolve(appSrc, './styles')],
    },
    transpileModules: ['@feat/feat-ui', '@feat/feat-editor'],
    webpack(config) {
      config.resolve.alias = {
        ...config.resolve.alias,
        ...extraWebpackConfig.resolve.alias,
      };
      // console.log(config.resolve);
      // console.log(extraWebpackConfig.module.rules);
      extraWebpackConfig.module.rules.forEach((rule) =>
        config.module.rules.push(rule),
      );
      // config.plugins.push(
      //   new FilterWarningsPlugin({
      //     exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
      //   }),
      // );

      return config;
    },
  },
);
