const path = require('path');
const svgTemplate = require('./svg.template');
const appPath = path.resolve(path.join(process.cwd(), 'app'));
const mockPath = path.resolve(path.join(process.cwd(), 'mock'));

const filename = '[name]-[hash:8].[ext]';
const inlineImageLimit = 10240; // 10k

const isStoryBook = process.env.STORYBOOK === 'true';

const getAssetLoader = (outputPath) => ({
  loader: 'url-loader',
  options: {
    limit: inlineImageLimit,
    fallback: {
      loader: 'file-loader',
      options: {
        name: filename,
        publicPath: isStoryBook ? outputPath : `/_next/${outputPath}`,
        outputPath,
      },
    },
    // name: filename,
    // publicPath: '/_next/',
    // outputPath,
  },
});

module.exports = {
  resolve: {
    alias: {
      '@': appPath,
      '@mock': mockPath,
      'draft-js': '@feat/draft-js',
      'draft-js-export-html': '@feat/draft-js-export-html',
      'draft-js-import-html': '@feat/draft-js-import-html',
    },
  },
  module: {
    rules: [
      {
        test: (filePath) =>
          /\.(jpg|jpeg|png|gif|ico|apng)$/.test(filePath) ||
          /avatar?\/.*?\.svg$/.test(filePath),
        issuer: /\.js$/,
        use: [getAssetLoader('static/images/')],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        issuer: /\.s?css$/,
        use: [getAssetLoader('static/images/')],
      },
      {
        test: /\.(mp3|mp4|webm)$/,
        use: [getAssetLoader('static/media/')],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: [getAssetLoader('static/fonts/')],
      },
      {
        test: /fonts?\/.*?\.svg$/,
        use: [getAssetLoader('static/fonts/')],
      },
      {
        test: /feat-ui\/.*\.svg$/,
        exclude: {
          or: [/fonts?\/.*?\.svg$/, /avatar\/.*?\.svg$/],
        },
        // issuer: /\.js$/,
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
        test: /\.svg$/,
        exclude: /feat-ui\/.*\.svg$/,
        issuer: /\.js$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              dimensions: false,
              expandProps: false,
              replaceAttrValues: {
                '#333': 'currentColor',
                '#f6f6f6': 'transparent',
              },
              svgoConfig: {
                plugins: [
                  {
                    prefixIds: {
                      prefixIds: true,
                      prefixClassNames: false,
                    },
                  },
                  {
                    removeAttrs: { attrs: '(data-name)' },
                  },
                ],
              },
              template: svgTemplate,
            },
          },
          getAssetLoader('static/images/'),
        ],
      },
    ],
  },
};
