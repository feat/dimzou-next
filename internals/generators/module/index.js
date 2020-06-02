/**
 * Container Generator
 */

const moduleExists = require('../utils/moduleExists');

module.exports = {
  description: 'Add a module',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Form',
      validate: (value) => {
        if (/.+/.test(value)) {
          return moduleExists(value)
            ? 'A module with this name already exists'
            : true;
        }

        return 'The name is required';
      },
    },
  ],
  actions: (data) => {
    const actions = [
      // messages
      {
        type: 'add',
        path: '../../app/modules/{{lowerCase name}}/messages.js',
        templateFile: './module/messages.js.hbs',
        abortOnFail: true,
      },
      // actions
      {
        type: 'add',
        path: '../../app/modules/{{lowerCase name}}/actions.js',
        templateFile: './module/actions.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../app/modules/{{lowerCase name}}/tests/actions.test.js',
        templateFile: './module/actions.test.js.hbs',
        abortOnFail: true,
      },
      // selectors
      {
        type: 'add',
        path: '../../app/modules/{{lowerCase name}}/selectors.js',
        templateFile: './module/selectors.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path:
          '../../app/modules/{{lowerCase name}}/tests/selectors.test.js',
        templateFile: './module/selectors.test.js.hbs',
        abortOnFail: true,
      },
      // reducer
      {
        type: 'add',
        path: '../../app/modules/{{lowerCase name}}/reducer.js',
        templateFile: './module/reducer.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../app/modules/{{lowerCase name}}/tests/reducer.test.js',
        templateFile: './module/reducer.test.js.hbs',
        abortOnFail: true,
      },
      // saga
      {
        type: 'add',
        path: '../../app/modules/{{lowerCase name}}/saga.js',
        templateFile: './module/saga.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../app/modules/{{lowerCase name}}/tests/saga.test.js',
        templateFile: './module/saga.test.js.hbs',
        abortOnFail: true,
      },
    ];

    return actions;
  },
};
