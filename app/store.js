/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';

import createReducer from './reducers';

// import { createComment } from './modules/comment/actions';
// import { openChatRoomWithUser } from './modules/party/actions';
// import { initOrderCreation } from './modules/commerce/actions/creation';

const sagaMiddleware = createSagaMiddleware();

export function configureStore(initialState = {}) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. thunk: async request 
  const middlewares = [
    sagaMiddleware,
    thunk,
  ];

  const enhancers = [applyMiddleware(...middlewares)];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    typeof window === 'object' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        shouldHotReload: false,
      })
      : compose;
  /* eslint-enable */
  const store = createStore(
    createReducer(),
    initialState,
    composeEnhancers(...enhancers),
  );

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  // window.store = store;
  return store;
}