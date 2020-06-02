module.exports = {
  collectCoverageFrom: [
    'app/**/*.{js,jsx}',
    '!app/**/*.test.{js,jsx}',
    '!app/*/RbGenerated*/*.{js,jsx}',
    '!app/index.js',
    '!app/global-styles.js',
    '!app/*/*/Loadable.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      statements: 2,
      branches: 2,
      functions: 2,
      lines: 2,
    },
  },
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '.*\\.(css|less|styl|scss|sass)$': '<rootDir>/internals/mocks/cssModule.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/internals/mocks/image.js',
    '@/([^\\.]*)$': '<rootDir>/app/$1',
    '@mock/([^\\.]*)$': '<rootDir>/mock/$1',
    'draft-js$': '@feat/draft-js',
    'draft-js/(.*)': '@feat/draft-js/$1',
  },
  setupFilesAfterEnv: [
    '<rootDir>/internals/testing/test-bundler.js',
    '<rootDir>/app/services/logging',
    '@testing-library/react/cleanup-after-each',
  ],
  setupFiles: ['raf/polyfill'],
  testRegex: 'tests/.*\\.test\\.js$',
  snapshotSerializers: [],
  transformIgnorePatterns: ['node_modules/(?!(@feat/feat-ui)/)'],
};
