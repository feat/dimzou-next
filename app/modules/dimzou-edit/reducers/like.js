import get from 'lodash/get';
import { mapHandleActions } from '@/utils/reducerCreators';

import {
  initLikeWidget,
  likeRewording,
  unlikeRewording,
  updateRewordingLikesCount,
  loadNodeEditInfo,
  patchContent,
} from '../actions';

const baseWidgetReducer = mapHandleActions(
  {
    [initLikeWidget]: (widgetState, action) => {
      const { payload } = action;
      if (widgetState && widgetState.isInitialized) {
        return widgetState;
      }
      return {
        nodeId: payload.nodeId,
        structure: payload.structure,
        blockId: payload.blockId,
        rewordingId: payload.rewordingId,
        rewordingLikesCount: get(
          widgetState,
          'rewordingLikesCount',
          payload.rewordingLikesCount,
        ),
        isInitialized: true,
      };
    },
    [likeRewording.REQUEST]: (widgetState) => ({
      ...widgetState,
      isLiking: true,
    }),
    [likeRewording.FULFILL]: (widgetState) => ({
      ...widgetState,
      isLiking: false,
    }),
    [unlikeRewording.REQUEST]: (widgetState) => ({
      ...widgetState,
      isUnliking: true,
    }),
    [unlikeRewording.FULFILL]: (widgetState) => ({
      ...widgetState,
      isUnliking: false,
    }),
  },
  {},
  (action) => action.payload.rewordingId,
);

const rewordingLikesCountReducer = (state = {}, action) => {
  const {
    payload: { rewordingLikesCount },
  } = action;
  const newState = { ...state };

  Object.keys(rewordingLikesCount).forEach((id) => {
    newState[id] = {
      ...state[id],
      rewordingLikesCount: rewordingLikesCount[id],
    };
  });
  return newState;
};

const initLikeWidgetWithNodeInfo = (state = {}, action) => {
  const newState = { ...state };
  const { data } = action.payload;
  let hasUpdate = false;
  if (data.title && data.title.rewordings) {
    data.title.rewordings.forEach((r) => {
      if (!newState[r.id]) {
        hasUpdate = true;
        newState[r.id] = {
          nodeId: data.id,
          structure: 'title',
          blockId: data.title.id,
          rewordingId: r.id,
          rewordingLikesCount: r.likes_count,
          isInitialized: true,
        }
      }
    })
  }
  if (data.summary && data.summary.rewordings) {
    data.summary.rewordings.forEach((r) => {
      if (!newState[r.id]) {
        hasUpdate = true;
        newState[r.id] = {
          nodeId: data.id,
          structure: 'summary',
          blockId: data.summary.id,
          rewordingId: r.id,
          rewordingLikesCount: r.likes_count,
          isInitialized: true,
        }
      }
    })
  }
  if (data.cover && data.cover.rewordings) {
    data.cover.rewordings.forEach((r) => {
      if (!newState[r.id]) {
        hasUpdate = true;
        newState[r.id] = {
          nodeId: data.id,
          structure: 'cover',
          blockId: data.cover.id,
          rewordingId: r.id,
          rewordingLikesCount: r.likes_count,
          isInitialized: true,
        }
      }
    })
  }
  if (data.content) {
    data.content.forEach((block) => {
      block.rewordings && block.rewordings.forEach((r) => {
        if (!newState[r.id]) {
          hasUpdate = true;
          newState[r.id] = {
            nodeId: data.id,
            structure: 'content',
            blockId: block.id,
            rewordingId: r.id,
            rewordingLikesCount: r.likes_count,
            isInitialized: true,
          }
        }
      })
    })
  }

  if (hasUpdate) {
    return newState;
  }
  return state;
}

const reducer = (state, action) => {
  if (
    action.type === loadNodeEditInfo.toString() ||
    action.type === patchContent.toString()
  ) {
    return initLikeWidgetWithNodeInfo(state, action);
  }
  if (
    action.type === likeRewording.SUCCESS ||
    action.type === unlikeRewording.SUCCESS ||
    action.type === updateRewordingLikesCount
  ) {
    return rewordingLikesCountReducer(state, action);
  }
  return baseWidgetReducer(state, action);
};

export default reducer;
