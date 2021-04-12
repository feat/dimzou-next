const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssNormalize = require('postcss-normalize');
const postcssFlexbugFixes = require('postcss-flexbugs-fixes');
const postcssPresetEnv = require('postcss-preset-env');
const getCSSModuleLocalIdent = require('./getCSSModuleLocalIdent');

const getStyleLoaders = (
  cssOptions,
  preProcessors = [],
  { isServer, isEnvDevelopment, isEnvProduction, shouldUseSourceMap },
) => {
  const loaders = [
    !isServer &&
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
      },
    !isServer && isEnvDevelopment && require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          postcssFlexbugFixes,
          postcssPresetEnv({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize(),
        ],
        sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
      },
    },
  ];

  // localsConvention: "camelCaseOnly"

  if (preProcessors.length) {
    // loaders.push(
    //   isServer && {
    //     loader: require.resolve('resolve-url-loader'),
    //     options: {
    //       sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
    //       root: paths.appSrc,
    //     },
    //   },
    // );
    preProcessors.forEach((p) => {
      loaders.push(p);
    });
  }
  return loaders.filter(Boolean);
};

const withStyle = (nextConfig = {}) => ({
  ...nextConfig,
  webpack(config, options) {
    const { dev, isServer, shouldUseSourceMap } = options;
    const isEnvDevelopment = dev;
    const isEnvProduction = !dev;

    const cssRegex = /\.css$/;
    const cssModuleRegex = /\.module\.css$/;
    const sassRegex = /\.(scss|sass)$/;
    const sassModuleRegex = /\.module\.(scss|sass)$/;

    const extraInfo = {
      isServer,
      isEnvDevelopment,
      isEnvProduction,
      shouldUseSourceMap,
      paths: nextConfig.paths,
    };
    // console.log('---------withStyle---------');
    if (!isServer) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: dev
            ? 'static/css/[name].css'
            : 'static/css/[name].[contenthash:8].css',
          chunkFilename: dev
            ? 'static/css/[name].chunk.css'
            : 'static/css/[name].[contenthash:8].chunk.css',
        }),
      );
    }

    // Legay CSS
    config.module.rules.push({
      test: cssRegex,
      exclude: cssModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 1,
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
        undefined,
        extraInfo,
      ),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    });

    // CSS modules
    config.module.rules.push({
      test: cssModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 1,
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          modules: {
            getLocalIdent: getCSSModuleLocalIdent,
            // exportOnlyLocals: isServer,
          },
        },
        undefined,
        extraInfo,
      ),
    });
    // legay SCSS
    config.module.rules.push({
      test: sassRegex,
      exclude: sassModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: true, // TO_CHECK: importLoaders may differ
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
        [
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
              sassOptions: nextConfig.sassOptions,
            },
          },
        ],
        extraInfo,
      ),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    });
    config.module.rules.push({
      test: sassModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: true,
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          modules: {
            getLocalIdent: getCSSModuleLocalIdent,
            exportOnlyLocals: isServer,
          },
        },
        [
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
              sassOptions: nextConfig.sassOptions,
            },
          },
        ],
        extraInfo,
      ),
    });
    // SCSS MODULE

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options);
    }

    return config;
  },
});

module.exports = withStyle;

// 服务器端 | 生产环境 | CSS module
// [cssLoader, postcssLoader, sassLoader],

// 客户端 | 生产环境
