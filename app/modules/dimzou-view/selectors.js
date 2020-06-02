import get from 'lodash/get';
import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import { dimzouBundle as dimzouBundleSchema, dimzouPublication as publicationSchema } from '@/schema';
import { selectEntities } from '@/modules/entity/selectors';
import { selectCategories } from '@/modules/category/selectors';
import { REDUCER_KEY, initialListState, initialDimzouViewState } from './reducer';

export const selectUserListState = (state, props) => get(state, [REDUCER_KEY, 'users', props.userId], initialListState);
export const makeSelectUserListState = () => createSelector(
  selectUserListState,
  selectEntities,
  (listState, entities) => {
    if (listState.list) {
      return denormalize(listState, { list: [dimzouBundleSchema]}, entities)
    }
    return listState;
  }
)

export const selectDimzouViewState = (state, props) => get(state, [REDUCER_KEY, 'bundles', props.bundleId], initialDimzouViewState);

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

const selectPublicationId = (_, props) => props.publicationId;

export const selectPublication = createSelector(
  selectPublicationId,
  selectEntities,
  (id, entityMap) => denormalize(id, publicationSchema, entityMap),
);
  
export const mapSelectPublication = () =>
  createSelector(selectPublicationId, selectEntities, (id, entityMap) =>
    denormalize(id, publicationSchema, entityMap),
  );
  