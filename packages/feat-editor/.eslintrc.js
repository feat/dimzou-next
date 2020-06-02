module.exports = {
    parser: 'babel-eslint',
    extends: 'airbnb',
    "plugins": [
      "jest"
    ],
    env: {
      browser: true,
      "jest/globals": true
    },
    rules: {
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }]
    },
}
