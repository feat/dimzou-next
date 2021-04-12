import { combineReducers } from 'redux';

import entityReducer from '@/modules/entity/reducer';
import menuReducer, {
  REDUCER_KEY as MENU_REDUCER_KEY,
} from '@/modules/menu/reducer';

import authReducer, {
  REDUCER_KEY as AUTH_REDUCER_KEY,
} from '@/modules/auth/reducer';
import categoryReducer, {
  REDUCER_KEY as CATE_REDUCER_KEY,
} from '@/modules/category/reducer';

import languageReducer from '@/modules/language/reducer';
import { REDUCER_KEY as LANGUAGE_REDUCER_KEY } from '@/modules/language/config';

import choicesReducer from '@/modules/choices/reducer';

import userInfoReducer, {
  REDUCER_KEY as USER_INFO_REDUCER_KEY,
} from '@/modules/user/reducer';

/** Pages */

export default function createRecuder(injectedReducers, fakeReducers) {
  const config = {
    ...fakeReducers,
    // Base
    entities: entityReducer,
    choices: choicesReducer,
    [AUTH_REDUCER_KEY]: authReducer,
    [MENU_REDUCER_KEY]: menuReducer,
    [CATE_REDUCER_KEY]: categoryReducer,
    [LANGUAGE_REDUCER_KEY]: languageReducer,

    // dynamic
    [USER_INFO_REDUCER_KEY]: userInfoReducer,

    // pages
    ...injectedReducers,
  };
  return combineReducers(config);
}
