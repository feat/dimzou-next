// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const withOptimize = (nextConfig = {}) => ({
  ...nextConfig,
  webpack(config, options) {
    // if (!isServer) {
    //   if (process.env.BUILD_ANALYZE === 'true') {
    //     config.plugins.push(new BundleAnalyzerPlugin());
    //   }
    //   if (process.env.NODE_ENV === 'production') {
    //     config.optimization.splitChunks = {
    //       chunks: 'all',
    //       cacheGroups: {
    //         default: false,
    //         vendors: false,
    //         commons: { name: 'commons', chunks: 'all', minChunks: 14 },
    //         react: {
    //           name: 'commons',
    //           chunks: 'all',
    //           test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
    //         },
    //         featui: {
    //           name: 'feat-ui',
    //           priority: 20,
    //           test: /[\\/]node_modules[\\/]@feat[\\/]feat-ui[\\/]/,
    //         },
    //         // styles: {
    //         //   name: 'styles',
    //         //   test: /\.+(css|scss|sass)$/,
    //         //   chunks: 'all',
    //         //   enforce: true,
    //         // },
    //       },
    //     };
    //   } else {
    //     config.optimization.splitChunks = {};
    //   }
    // }
    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options);
    }
    return config;
  },
});

module.exports = withOptimize;
