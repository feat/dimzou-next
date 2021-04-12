import get from 'lodash/get';
import { createSelector } from 'reselect';

import { denormalize } from 'normalizr';
import { dimzouPublication as publicationSchema } from '@/schema';
import { selectEntities } from '@/modules/entity/selectors';
import { selectCategories } from '@/modules/category/selectors';
import { REDUCER_KEY, initialMetaState, initialContentState } from './config';

export const selectPublicationMetaState = (state, props) =>
  get(state, [REDUCER_KEY, 'meta', props.bundleId], initialMetaState);

export const selectContentState = createSelector(
  (state, props) =>
    get(state, [REDUCER_KEY, 'content', props.nodeId], initialContentState),
  selectEntities,
  (blockState, entities) => {
    const publicationId = blockState?.data?.publication;
    if (!publicationId) {
      return blockState;
    }
    const mapped = {
      ...blockState,
      data: { ...blockState.data },
    };
    mapped.data.publication = denormalize(
      publicationId,
      publicationSchema,
      entities,
    );

    if (mapped.data.publication.category) {
      let { category } = mapped.data.publication;
      const categoryMap = selectCategories({ entities });
      const categories = [];
      while (category) {
        categories.push(category);
        category = categoryMap[category.parent_id];
      }
      mapped.data.categories = categories.reverse();
    }

    return mapped;
  },
);

export const makeSelectPublicationCategories = (publicationSelector) =>
  createSelector(
    publicationSelector,
    selectCategories,
    (publication, categoryMap) => {
      if (!publication) {
        return [];
      }
      let { category } = publication;
      const categories = [];
      while (category) {
        categories.push(category);
        category = categoryMap[category.parent_id];
      }
      return categories.reverse();
    },
  );
