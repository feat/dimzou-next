import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import get from 'lodash/get';

import { selectEntities } from '@/modules/entity/selectors';

import { like as likeSchema } from './schema';
import { getWidgetKey } from './reducer';
import { REDUCER_KEY } from './config';

/**
 * Direct selector to the commentBundle state domain
 */
export const selectLikeWidget = (state, props) => {
  const key = getWidgetKey(props);
  const bundleState = state[REDUCER_KEY];
  if (!bundleState) {
    return undefined;
  }
  return bundleState[key];
};

export const selectLikeCount = (state, props) => {
  const key = getWidgetKey(props);
  return get(state, [REDUCER_KEY, key, 'likesCount']);
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by LikeWidget
 */

const makeSelectLikeWidget = () =>
  createSelector(selectLikeWidget, selectEntities, (subState, entityMap) => {
    if (!subState) {
      return subState;
    }
    const likes = denormalize(subState.likes, [likeSchema], entityMap);
    return {
      ...subState,
      likes,
    };
  });

export default makeSelectLikeWidget;
