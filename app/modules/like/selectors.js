import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';

import { like as likeSchema } from '@/schema';
import { selectEntities } from '@/modules/entity/selectors';

import { getWidgetKey, REDUCER_KEY } from './reducer';

/**
 * Direct selector to the commentBundle state domain
 */
const selectLikeWidget = (state, props) => {
  const key = getWidgetKey(props);
  const bundleState = state[REDUCER_KEY];
  if (!bundleState) {
    return undefined;
  }
  return bundleState[key];
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
export { selectLikeWidget };
