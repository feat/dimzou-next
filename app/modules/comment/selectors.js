import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import get from 'lodash/get';

import { selectEntities } from '@/modules/entity/selectors';

import tryToGetKey from '@/utils/tryToGetKey';
import { comment as commentSchema } from './schema';

import { REDUCER_KEY, getBundleKey } from './config';

/**
 * Direct selector to the comment state domain
 */
export const selectComment = (state, props) => {
  const commentId = tryToGetKey(props, 'id');
  return get(state, ['entities', commentSchema.key, String(commentId)]);
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by Comment
 */

export const makeSelectComment = () =>
  createSelector(selectComment, selectEntities, (substate, entityMap) => {
    if (!substate) {
      return substate;
    }
    return denormalize(substate, commentSchema, entityMap);
  });

/**
 * Direct selector to the commentBundle state domain
 */
export const selectCommentBundle = (state, props) => {
  const key = getBundleKey(props);
  return get(state, [REDUCER_KEY, 'bundles', key]);
};

export const selectCommentsCount = (state, props) => {
  const key = getBundleKey(props);
  return get(state, [REDUCER_KEY, 'bundles', key, 'rootCount']);
};

export const selectBundleComment = (state, props) => {
  const bundleState = selectCommentBundle(state, props);
  return get(bundleState, ['entities', commentSchema.key, props.commentId]);
};

export const makeSelectCommentBundle = () =>
  createSelector(selectCommentBundle, (subState) => {
    if (!subState) {
      return undefined;
    }
    const { entities, ...bundleState } = subState;
    return denormalize(
      bundleState,
      {
        comments: [commentSchema],
      },
      entities,
    );
  });
