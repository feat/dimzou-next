import get from 'lodash/get';
import { REDUCER_KEY } from './reducer';

export const selectIsFetchingCategories = (state) =>
  get(state, [REDUCER_KEY, 'category', 'loading']);

export const selectIsFetchingSection = (state, categoryId) =>
  get(state, [REDUCER_KEY, 'sections', categoryId, 'loading']);
