import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import get from 'lodash/get';
import { selectEntities } from '@/modules/entity/selectors';
import { dimzouBundle as dimzouBundleSchema } from '@/schema';

import { REDUCER_KEY, initialRequestState } from './reducer';

export const selectTableState = createSelector(
  (state, props) => {
    const key = get(props, 'router.query.type', 'created');
    return get(state, [REDUCER_KEY, key], initialRequestState);
  },
  selectEntities,
  (tableState, entityMap) => {
    const mapped = { ...tableState };
    if (tableState.items) {
      mapped.items = denormalize(
        tableState.items,
        [dimzouBundleSchema],
        entityMap,
      );
    }
    return mapped;
  },
);
