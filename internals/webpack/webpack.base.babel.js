/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// const extractSass = new ExtractTextPlugin({
//   filename: 'css/[name].[hash].css',
//   disable: process.env.NODE_ENV === 'development',
//   allChunks: true,
// });

const prodMode = process.env.NODE_ENV === 'production';

// Remove this line once the following warning goes away (it was meant for webpack loader authors not users):
// 'DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic,
// see https://github.com/webpack/loader-utils/issues/56 parseQuery() will be replaced with getOptions()
// in the next major version of loader-utils.'
process.noDeprecation = true;

module.exports = (options) => ({
  mode: options.mode,
  entry: options.entry,
  output: Object.assign(
    {
      // Compile into js/build.js
      path: path.resolve(process.cwd(), 'build'),
      publicPath: '/',
    },
    options.output,
  ), // Merge with env dependent settings
  optimization: options.optimization,
  module: {
    rules: [
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: options.babelQuery,
        },
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          prodMode
            ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  // you can specify a publicPath here
                  // by default it use publicPath in webpackOptions.output
                  publicPath: '../',
                },
              }
            : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, '../../app/styles')],
            },
          },
        ],
        // loader: extractSass.extract({
        //   use: [
        //     {
        //       loader: 'css-loader',
        //       options: {
        //         sourceMap: true,
        //       },
        //     },
        //     {
        //       loader: 'sass-loader',
        //       options: {
        //         includePaths: [path.resolve(__dirname, '../../app/styles')],
        //       },
        //     },
        //   ],
        //   // use style-loader in development
        //   fallback: 'style-loader',
        // }),
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /fonts?\/.*?\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[hash].[ext]',
            },
          },
        ],
      },
      {
        test: (path) => {
          return /\.svg$/.test(path) && !/fonts?\/.*?\.svg$/.test(path);
        },
        use: [
          {
            loader: 'svg-inline-loader',
            options: {
              removingTagAttrs: ['id'],
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        issuer: /\.s?css$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10 * 1024,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: prodMode ? '[hash:7].[ext]' : '[name].[ext]',
                  publicPath: '/images',
                  outputPath: 'images',
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        issuer: /\.js$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: prodMode ? '[hash:7].[ext]' : '[name].[ext]',
              publicPath: '/images',
              outputPath: 'images',
            },
          },
          // {
          //   loader: 'image-webpack-loader',
          //   options: {
          //     mozjpeg: {
          //       enabled: false,
          //       // NOTE: mozjpeg is disabled as it causes errors in some Linux environments
          //       // Try enabling it in your environment by switching the config to:
          //       // enabled: true,
          //       // progressive: true,
          //     },
          //     gifsicle: {
          //       interlaced: false,
          //     },
          //     optipng: {
          //       optimizationLevel: 7,
          //     },
          //     pngquant: {
          //       quality: '65-90',
          //       speed: 4,
          //     },
          //   },
          // },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(mp3|mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
    ],
  },
  plugins: options.plugins.concat([
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; Terser will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
        RELEASE_TAG: JSON.stringify(process.env.RELEASE_TAG || 'preview'),
      },
    }),
    new webpack.NamedModulesPlugin(),
    // extractSass,
    new MiniCssExtractPlugin({
      filename: prodMode ? 'css/[name].[hash].css' : 'css/[name].css',
      chunkFilename: prodMode ? 'css/[id].[hash].css' : 'css/[id].css',
    }),
    new webpack.ContextReplacementPlugin(/^\.\/locale$/, (context) => {
      if (!/\/moment\//.test(context.context)) return;

      Object.assign(context, {
        regExp: /^\.\/\w+/,
        request: '../../locale', // resolved relatively
      });
    }),
  ]),
  resolve: {
    modules: ['node_modules', 'app'],
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    alias: {
      '@': path.resolve(path.join(process.cwd(), 'app')),
      '@feat/mobile-ui': path.resolve(path.join(process.cwd(), 'mobile-ui')),
      'draft-js': '@feat/draft-js',
      immutable: path.resolve(
        path.join(process.cwd(), 'node_modules', 'immutable'),
      ),
      'query-string': path.resolve(
        path.join(process.cwd(), 'node_modules', 'query-string'),
      ),
      'prop-types': path.resolve(
        path.join(process.cwd(), 'node_modules', 'prop-types'),
      ),
    },
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
});
