const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier', 'redux-saga', 'react', 'jsx-a11y'],
  env: {
    jest: true,
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'no-shadow': 1,
    'prettier/prettier': [0, prettierOptions],
    'arrow-parens': ['error', 'always'],
    'arrow-body-style': [2, 'as-needed'],
    'class-methods-use-this': 0,
    'comma-dangle': [2, 'always-multiline'],
    camelcase: 1,
    'import/imports-first': 0,
    'import/newline-after-import': 0,
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/no-unresolved': 1,
    'import/no-webpack-loader-syntax': 0,
    'import/prefer-default-export': 0,
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
      },
    ],
    'jsx-a11y/aria-props': 2,
    'jsx-a11y/heading-has-content': 0,
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        // NOTE: If this error triggers, either disable it or add
        // your custom components, labels and attributes via these options
        // See https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
        controlComponents: ['Input'],
      },
    ],
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/mouse-events-have-key-events': 2,
    'jsx-a11y/role-has-required-aria-props': 2,
    'jsx-a11y/role-supports-aria-props': 2,
    'jsx-a11y/no-autofocus': 1,
    'jsx-a11y/click-events-have-key-events': 1,
    'jsx-a11y/no-static-element-interactions': 1,
    'max-len': 0,
    'newline-per-chained-call': 0,
    'no-confusing-arrow': 0,
    'no-console': 2,
    'no-continue': 1,
    'no-unused-vars': 2,
    'no-underscore-dangle': 1,
    'no-unused-expressions': [2, { allowShortCircuit: true }],
    'no-use-before-define': 0,
    'prefer-template': 2,
    'react/destructuring-assignment': 0,
    'react/jsx-closing-tag-location': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-first-prop-new-line': [2, 'multiline'],
    'react/no-find-dom-node': 1,
    'react/jsx-filename-extension': 0,
    'react/jsx-no-target-blank': 0,
    'react/jsx-uses-vars': 2,
    'react/require-default-props': 0,
    'react/require-extension': 0,
    'react/self-closing-comp': 0,
    'react/sort-comp': 0,
    'react/prefer-stateless-function': 1,
    'react/no-array-index-key': 1,
    'react/no-access-state-in-setstate': 1,
    'redux-saga/no-yield-in-race': 2,
    'redux-saga/yield-effects': 2,
    'require-yield': 0,
    'prefer-destructuring': 1,
    'jsx-a11y/anchor-is-valid': 1,
    'react/react-in-jsx-scope': 0
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack.config.js',
      },
    },
  },
  globals: {
    Project: true,
    SENTRY_DSN: true,
    logging: true,
    ga: true,
    FEAT_CHOICES: true,
    store: true,
    ReactIntl: true,
  },
};
