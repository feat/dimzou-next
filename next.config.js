/* eslint-disable no-param-reassign */
const path = require('path');
// const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const withSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'hidden-source-map',
});
const withTM = require('@weco/next-plugin-transpile-modules');
const aliases = require('./alias-config');

const appPath = path.resolve(path.join(process.cwd(), 'app'));

module.exports = withTM(
  withSourceMaps(
    withCSS(
      withSass({
        distDir: 'build',
        generateBuildId: async () => process.env.RELEASE_TAG || 'preview',
        inlineImageLimit: 10240,
        assetPrefix: process.env.NEXT_ASSET_PREFIX || '',
        publicRuntimeConfig: {
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
        },
        env: {
          RELEASE_TAG: process.env.RELEASE_TAG || 'preview',
          BRANCH: process.env.CI_COMMIT_REF_NAME,
        },
        crossOrigin: 'anonymous',
        cssModules: false,
        cssLoaderOptions: {
          ignoreOrder: true,
        },
        sassLoaderOptions: {
          includePaths: [path.resolve(appPath, './styles')],
        },
        transpileModules: [
          '@feat/feat-ui',
          '@feat/feat-editor',
          'react-dnd-html5-backend',
          'react-dnd',
        ],
        webpack(config, options) {
          const { isServer, config: nextConfig } = options;
          config.resolve.alias = {
            ...config.resolve.alias,
            ...aliases,
          };
          config.module.rules.push({
            test: /\.(jpg|png|gif)$/,
            issuer: /\.js$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name]-[hash].[ext]',
                  publicPath: `${nextConfig.assetPrefix}/_next/static/images/`,
                  outputPath: `${isServer ? '../' : ''}static/images/`,
                },
              },
            ],
          });

          config.module.rules.push({
            test: /\.(jpg|png|gif)$/,
            issuer: /\.s?css$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: nextConfig.inlineImageLimit,
                  fallback: {
                    loader: 'file-loader',
                    options: {
                      name: '[name]-[hash].[ext]',
                      publicPath: `${
                        nextConfig.assetPrefix
                      }/_next/static/images/`,
                      outputPath: `${isServer ? '../' : ''}static/images/`,
                    },
                  },
                },
              },
            ],
          });

          config.module.rules.push({
            test: /\.(mp3|mp4|webm)$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: nextConfig.inlineImageLimit,
                fallback: require.resolve('file-loader'),
                publicPath: `${nextConfig.assetPrefix}/_next/static/media/`,
                outputPath: `${isServer ? '../' : ''}static/media/`,
                name: '[name]-[hash].[ext]',
              },
            },
          });

          config.module.rules.push({
            test: /\.(eot|otf|ttf|woff|woff2)$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: nextConfig.inlineImageLimit,
                  fallback: require.resolve('file-loader'),
                  publicPath: `${nextConfig.assetPrefix}/_next/static/fonts/`,
                  outputPath: `${isServer ? '../' : ''}static/fonts/`,
                  name: '[name]-[hash].[ext]',
                },
              },
            ],
          });

          config.module.rules.push({
            test: /fonts?\/.*?\.svg$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: nextConfig.inlineImageLimit,
                  fallback: require.resolve('file-loader'),
                  publicPath: `${nextConfig.assetPrefix}/_next/static/fonts/`,
                  outputPath: `${isServer ? '../' : ''}static/fonts/`,
                  name: '[name]-[hash].[ext]',
                },
              },
            ],
          });

          config.module.rules.push({
            test: (path) =>
              /\.svg$/.test(path) && !/fonts?\/.*?\.svg$/.test(path),
            use: [
              {
                loader: 'svg-inline-loader',
                options: {
                  removingTagAttrs: ['id'],
                },
              },
            ],
          });

          // config.plugins.push(
          //   new FilterWarningsPlugin({
          //     exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
          //   }),
          // );

          return config;
        },
      }),
    ),
  ),
);
