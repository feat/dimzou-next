import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';

import { dimzouPublication as publicationSchema } from '@/schema';
import tryToGetKey from '@/utils/tryToGetKey';
import { selectEntities } from '@/modules/entity/selectors';

const selectPublicationId = (_, props) => tryToGetKey(props, 'id');

export const selectPublication = createSelector(
  selectPublicationId,
  selectEntities,
  (id, entityMap) => denormalize(id, publicationSchema, entityMap),
);

export const mapSelectPublication = () =>
  createSelector(selectPublicationId, selectEntities, (id, entityMap) =>
    denormalize(id, publicationSchema, entityMap),
  );
