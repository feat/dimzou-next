/*
 *
 * Category actions
 *
 */

import { createRoutine } from 'redux-saga-routines';

import { normalize } from 'normalizr';

import { category as categorySchema } from '@/schema';

import {
  fetchUserCategories as fetchUserCategoriesRequest,
  createCategory as createCategoryRequest,
} from '@/client/category';

const NS = 'CATEGORY';

export const createCategory = createRoutine(`${NS}/CREATE_CATEGORY`);

export const fetchUserCategories = createRoutine(`${NS}/FETCH_USER_CATEGORIES`);

export const asyncCreateCategory = (payload) => async (dispatch) => {
  try {
    const { data } = await createCategoryRequest({
      parent_id: payload.parentId,
      name: payload.name,
    });
    const normalized = normalize(data, categorySchema);
    dispatch(
      createCategory.success({
        categoryId: normalized.result,
        entities: normalized.entities,
        category: data,
      }),
    );
    return data;
  } catch (err) {
    dispatch(createCategory.failure(err));
    throw err;
  }
}

export const asyncFetchUserCategories = () => async (dispatch) => {
  try {
    const { data } = await fetchUserCategoriesRequest();
    const normalized = normalize(data, [categorySchema]);
    dispatch(
      fetchUserCategories.success({
        list: normalized.result,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(fetchUserCategories.failure(err));
    throw err;
  }
}