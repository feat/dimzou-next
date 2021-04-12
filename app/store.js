/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import { routinePromiseWatcherSaga } from 'redux-saga-routines';

import createReducer from './reducers';

// import { createComment } from './modules/comment/actions';
// import { openChatRoomWithUser } from './modules/party/actions';
// import { initOrderCreation } from './modules/commerce/actions/creation';

const sagaMiddleware = createSagaMiddleware();

export function configureStore(initialState = {}, thunkExtra) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. thunk: async request
  const middlewares = [sagaMiddleware, thunk.withExtraArgument(thunkExtra)];

  const enhancers = [applyMiddleware(...middlewares)];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          shouldHotReload: false,
        })
      : compose;
  /* eslint-enable */

  // hack createStore initialState validation.
  const fakeReducer = (state) => state || null;
  const fackeReducerMap = {};
  Object.keys(initialState).forEach((key) => {
    fackeReducerMap[key] = fakeReducer;
  });

  const store = createStore(
    createReducer(undefined, fackeReducerMap),
    initialState,
    composeEnhancers(...enhancers),
  );

  // Extensions
  store.fakeReducers = fackeReducerMap;
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  if (typeof window === 'object') {
    store.runSaga(routinePromiseWatcherSaga);
  }

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  return store;
}
