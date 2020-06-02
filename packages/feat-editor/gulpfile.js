/* eslint-disable */
const babel = require('gulp-babel');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const concatCSS = require('gulp-concat-css');
const flatten = require('gulp-flatten');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const webpackStream = require('webpack-stream');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const paths = {
  dist: 'dist',
  lib: 'lib',
  src: [
    'src/**/*.js',
    '!src/**/__tests__/**/*.js',
    '!src/**/__mocks__/**/*.js',
    '!src/**/**.test.js',
  ],
  css: ['src/**/*.scss'],
  assets: ['src/**/*.svg', 'src/**/*.png'],
};

const babelOptsJS = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-flow',
  ],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-class-properties',
  ],
};

const buildDist = function(opts) {
  const webpackOpts = {
    // debug: opts.debug,
    externals: {
      immutable: {
        root: 'Immutable',
        commonjs2: 'immutable',
        commonjs: 'immutable',
        amd: 'immutable',
      },
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
      'draft-js': {
        root: 'Draft',
        commonjs2: 'draft-js',
        commonjs: 'draft-js',
        amd: 'draft-js',
      },
      '@feat/draft-js': {
        root: 'Draft',
        commonjs2: 'draft-js',
        commonjs: 'draft-js',
        amd: 'draft-js',
      },
    },
    output: {
      filename: opts.output,
      libraryTarget: 'umd',
      library: opts.library,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: 'null-loader',
        },
        {
          test: /\.scss$/,
          use: 'null-loader',
        },
      ],
    },
    resolve: {
      alias: {
        'draft-js': '@feat/draft-js',
      },
    },
    plugins: [
      new webpackStream.webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(opts.debug ? 'development' : 'production'),
      }),
      new webpackStream.webpack.LoaderOptionsPlugin({
        debug: true,
      }),
    ],
  };
  if (!opts.debug) {
    webpackOpts.plugins.push(new UglifyJsPlugin());
  }
  return webpackStream(webpackOpts, null, (err, stats) => {
    if (err) {
      throw new gulpUtil.PluginError('webpack', err);
    }
    if (stats.compilation.errors.length) {
      gulpUtil.log('webpack', `\n${stats.toString({ colors: true })}`);
    }
  });
};

gulp.task('clean', () => del([paths.dist, paths.lib]));

gulp.task('assets', () => {
  return gulp.src(paths.assets).pipe(gulp.dest(paths.lib));
});

gulp.task('modules', () =>
  gulp
    .src(paths.src)
    .pipe(babel(babelOptsJS))
    // .pipe(flatten())
    .pipe(gulp.dest(paths.lib)),
);

gulp.task('css', () => {
  return gulp
    .src(paths.css)
    .pipe(sass())
    .pipe(concatCSS('FeatEditor.css'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task(
  'dist',
  gulp.series('modules', 'css', 'assets', () => {
    const opts = {
      debug: true,
      output: 'FeatEditor.js',
      library: 'FeatEditor',
    };
    return (
      gulp
        .src('./src/FeatEditor.js')
        .pipe(buildDist(opts))
        // .pipe(derequire())
        // .pipe(header(COPYRIGHT_HEADER, {version: packageData.version}))
        .pipe(gulp.dest(paths.dist))
    );
  }),
);

gulp.task(
  'dist:min',
  gulp.series(() => {
    var opts = {
      debug: false,
      output: 'FeatEditor.min.js',
      library: 'FeatEditor',
    };
    return (
      gulp
        .src('./src/FeatEditor.js')
        .pipe(buildDist(opts))
        // .pipe(header(COPYRIGHT_HEADER, {version: packageData.version}))
        .pipe(gulp.dest(paths.dist))
    );
  }),
);

gulp.task(
  'audit:min',
  gulp.series(() => {
    var opts = {
      debug: false,
      output: 'AuditEditor.js',
      library: 'AuditEditor',
    };
    return gulp
      .src('./src/AuditEditor.js')
      .pipe(buildDist(opts))
      .pipe(gulp.dest(paths.dist));
  }),
);
