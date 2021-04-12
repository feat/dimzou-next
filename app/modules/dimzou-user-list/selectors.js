import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import get from 'lodash/get';

import { selectEntities } from '@/modules/entity/selectors';
import { dimzouBundle as dimzouBundleSchema } from '../dimzou-edit/schema';

import { REDUCER_KEY, initialListState } from './config';
export const selectListState = (state, props) =>
  get(state, [REDUCER_KEY, props.userId], initialListState);

export const makeSelectListState = () =>
  createSelector(selectListState, selectEntities, (listState, entities) => {
    if (listState.list) {
      return denormalize(listState, { list: [dimzouBundleSchema] }, entities);
    }
    return listState;
  });
