import update from 'immutability-helper';

import { mapHandleActions } from '@/utils/reducerCreators';

import {
  initWidget,
  initWidgetSuccess,
  createLike,
  deleteLike,
  likeSignal,
} from './actions';

const intialWigetState = {
  isInitialized: false,
  fetchingLikes: true,
  likes: [],
  likesCount: 0,
  userHasLiked: false,
};

export const REDUCER_KEY = 'like';

export function getWidgetKey(payload = {}) {
  const { entityType, entityId } = payload;
  if (entityType === undefined) {
    logging.warn('entityType is required');
  }
  if (entityId === undefined) {
    logging.warn('entityId is required');
  }
  return `${entityType}_${entityId}`;
}

const keyExtractor = (action) => getWidgetKey(action.payload);

const likeWidgetReducer = mapHandleActions(
  {
    [initWidget]: (state, action) => ({
      ...state,
      isInitialized: true,
      fetchingLikes: false,
      likes: action.payload.initialData.likes || [],
      likesCount: action.payload.initialData.likesCount,
      userHasLiked: action.payload.initialData.userHasLiked,
    }),
    [initWidgetSuccess]: (state) => ({
      ...state,
      isInitialized: true,
      fetchingLikes: false,
    }),
    [createLike.SUCCESS]: (state, action) =>
      update(state, {
        likesCount: {
          $apply: (count) => count + 1,
        },
        likes: {
          $apply: (list) => list.concat(action.payload.id),
        },
        userHasLiked: {
          $set: true,
        },
      }),
    [deleteLike.SUCCESS]: (state, action) =>
      update(state, {
        likesCount: {
          $apply: (count) => count - 1,
        },
        likes: {
          $apply: (list) => list.filter((id) => id !== action.payload.id),
        },
        userHasLiked: {
          $set: false,
        },
      }),
    [likeSignal]: (state, action) => {
      switch (action.payload.status) {
        case 'deleted':
          return update(state, {
            likesCount: {
              $apply: (count) => count - 1,
            },
            likes: {
              $apply: (list) => list.filter((id) => id !== action.payload.id),
            },
            userHasLiked: {
              $apply: (liked) => {
                if (action.payload.isCurrentUserLike) {
                  return false;
                }
                return liked;
              },
            },
          });
        case 'created':
          return update(state, {
            likesCount: {
              $apply: (count) => count + 1,
            },
            likes: {
              $apply: (list) => list.concat(action.payload.id),
            },
            userHasLiked: {
              $apply: (liked) => {
                if (action.payload.isCurrentUserLike) {
                  return true;
                }
                return liked;
              },
            },
          });
        default:
          return state;
      }
    },
  },
  intialWigetState,
  keyExtractor,
);

export default likeWidgetReducer;
