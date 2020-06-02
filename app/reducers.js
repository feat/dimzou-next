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
import languageReducer, {
  REDUCER_KEY as LANGUAGE_REDUCER_KEY,
} from '@/modules/language/reducer';
import commentReducer, {
  REDUCER_KEY as COMMENT_REDUCER_KEY,
} from '@/modules/comment/reducers';
import likeReducer, {
  REDUCER_KEY as LIKE_REDUCER_KEY,
} from '@/modules/like/reducer';

import choicesReducer from '@/modules/choices/reducer';


import dimzouAdminReducer, {
  REDUCER_KEY as DIMZOU_ADMIN_REDUCER_KEY,
} from '@/modules/dimzou-admin/reducer';


import userInfoReducer, {
  REDUCER_KEY as USER_INFO_REDUCER_KEY,
} from '@/modules/user/reducer';

/** Pages */
import dimzouIndexRedcuer, {
  REDUCER_KEY as DIMZOU_INDEX_REDUCER_KEY,
} from '@/routes/DimzouIndex/reducer';

import dimzouViewReducer, {
  REDUCER_KEY as DIMZOU_VIEW_REDUCER_KEY,
} from '@/modules/dimzou-view/reducer';
import dimzouEditReducer, {
  REDUCER_KEY as DIMZOU_EDIT_REDUCER_KEY,
} from '@/modules/dimzou-edit/reducers';


export default function createRecuder(injectedReducers) {
  return combineReducers({
    entities: entityReducer,
    choices: choicesReducer,

    [MENU_REDUCER_KEY]: menuReducer,
    [COMMENT_REDUCER_KEY]: commentReducer,
    [LIKE_REDUCER_KEY]: likeReducer,
    [AUTH_REDUCER_KEY]: authReducer,
    [LANGUAGE_REDUCER_KEY]: languageReducer,
    [CATE_REDUCER_KEY]: categoryReducer,
    [USER_INFO_REDUCER_KEY]: userInfoReducer,

    [DIMZOU_EDIT_REDUCER_KEY]: dimzouEditReducer,

    [DIMZOU_ADMIN_REDUCER_KEY]: dimzouAdminReducer,

    // pages
    [DIMZOU_INDEX_REDUCER_KEY]: dimzouIndexRedcuer,
    [DIMZOU_VIEW_REDUCER_KEY]: dimzouViewReducer,

    ...injectedReducers,
  });
}
