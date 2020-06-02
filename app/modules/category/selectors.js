import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import listToTree from 'list-to-tree-lite';
import get from 'lodash/get';

import { selectEntities } from '@/modules/entity/selectors';
import { category as categorySchema } from '@/schema';
import { REDUCER_KEY } from './reducer';
import tryToGetKey from '../../utils/tryToGetKey';

/**
 * Direct selector to the category state domain
 */
export const selectCategories = (state) =>
  get(state, ['entities', categorySchema.key]);

/**
 * Other specific selectors
 */
export const selectCategory = (state, props) => {
  const categoryId = tryToGetKey(props, 'categoryId');
  return get(state, ['entities', categorySchema.key, String(categoryId)]);
};

export const makeSelectCategories = () =>
  createSelector(selectCategories, (substate) => substate);

export const makeSelectCategory = () =>
  createSelector(selectCategory, selectEntities, (category, entityMap) => {
    if (!category) {
      return null;
    }

    return denormalize(category, categorySchema, entityMap);
  });

export const makeSelectTopCategoryList = () =>
  createSelector(selectCategories, (categoryMap) =>
    Object.values(categoryMap).filter((item) => !item.parent_id),
  );

export const makeSelectCategoryTree = () =>
  createSelector(selectCategories, (categoryMap) => {
    const categories = Object.values(categoryMap);
    return listToTree(categories, {
      idKey: 'id',
      parentKey: 'parent_id',
    });
  });

export const selectCategoryTree = createSelector(
  selectCategories,
  (categoryMap) => {
    const tree = listToTree(Object.values(categoryMap), {
      idKey: 'id',
      parentKey: 'parent_id',
    });

    calcFeedsCountWithDescendantsAndSort(tree);

    // tree.forEach((item) => calcFeedsCountWithDescendants(item));
    // tree.sort((a, b) => b.meta.feedsCountWithDescendants - a.meta.feedsCountWithDescendants);

    return tree;
  },
);

function calcFeedsCountWithDescendantsAndSort(collection) {
  const counts = collection.map((item) => calcFeedsCountWithDescendants(item));
  collection.sort(
    (a, b) =>
      b.meta.feedsCountWithDescendants - a.meta.feedsCountWithDescendants,
  );
  return counts;
}

function calcFeedsCountWithDescendants(item) {
  const selfCount = item.meta ? item.meta.feeds_count || 0 : 0;
  /* eslint-disable */
  item.meta = item.meta || {};
  if (!item.children || !item.children.length) {
    item.meta.feedsCountWithDescendants = selfCount;
  } else {
    item.meta.feedsCountWithDescendants =
      selfCount +
      calcFeedsCountWithDescendantsAndSort(item.children).reduce(
        (a, b) => a + b,
        0,
      );
  }
  /* eslint-enable */
  return item.meta.feedsCountWithDescendants;
}

export const selectCategoryModuleState = (state) => state[REDUCER_KEY];

export const selectUserCategories = createSelector(
  (state) => selectCategoryModuleState(state).userCategories,
  selectEntities,
  (list, entityMap) => {
    if (!list) {
      return list;
    }
    return denormalize(list, [categorySchema], entityMap);
  },
);

export const selectCategoriesHasFetched = (state) =>
  !!selectCategoryModuleState(state).userCategories;
