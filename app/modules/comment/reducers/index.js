import { combineReducers } from 'redux';

import bundleReducer from './bundle';

export default combineReducers({
  bundles: bundleReducer,
});
