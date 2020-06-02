import get from 'lodash/get';
import tryToGetKey from '@/utils/tryToGetKey';

import { REDUCER_KEY, initialPageState } from './reducer';


export const selectPageContent = (state, props) => {
  const categoryId = tryToGetKey(props, 'categoryId');
  return get(state, [REDUCER_KEY, String(categoryId)], initialPageState);
}