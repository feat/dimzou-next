import { createSelector } from 'reselect';
import get from 'lodash/get';

import { selectEntities } from '@/modules/entity/selectors';
import { selectCategoriesHasFetched } from '@/modules/category/selectors';

import { category as categorySchema } from '@/schema';

import tryToGetKey from '@/utils/tryToGetKey';

export const makeSelectPageCategory = () =>
  createSelector(
    selectCategoriesHasFetched,
    (_, props) => tryToGetKey(props, 'categoryId'),
    selectEntities,
    (fetched, categoryId, entityMap) => {
      if (!fetched) {
        return null;
      }
      const category = get(entityMap, [categorySchema.key, String(categoryId)]);
      if (!category) {
        return false;
      }

      let pageCategory;
      let pageCategoryId;

      const children = Object.values(entityMap[categorySchema.key]).filter(
        (item) => item.parent_id === category.id,
      );

      if (children.length) {
        pageCategory = { ...category };
        pageCategory.children = children;
        return pageCategory;
      }

      if (category.parent_id) {
        pageCategoryId = category.parent_id;
        pageCategory = get(entityMap, [
          categorySchema.key,
          String(pageCategoryId),
        ]);
      } else {
        pageCategory = category;
        pageCategoryId = pageCategory.id;
      }

      pageCategory.children = Object.values(
        entityMap[categorySchema.key],
      ).filter((item) => item.parent_id === pageCategoryId);

      return pageCategory;
    },
  );
