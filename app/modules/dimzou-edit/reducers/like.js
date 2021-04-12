import get from 'lodash/get';
import { mapHandleActions } from '@/utils/reducerCreators';

import {
  initLikeWidget,
  likeRewording,
  unlikeRewording,
  updateRewordingLikesCount,
  initNodeEdit,
  loadBlockRange,
  commitBlock,
  submitBlock,
  submitMediaBlock,
  commitMediaBlock,
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

const initWithNodeInit = (state = {}, action) => {
  const newState = { ...state };
  const { basic, title, summary, cover, blocks } = action.payload;
  let hasUpdate = false;
  Object.values(blocks).forEach((block) => {
    block.rewordings.forEach((r) => {
      if (!newState[r.id]) {
        hasUpdate = true;
        let structure;
        switch (block.id) {
          case title:
            structure = 'title';
            break;
          case summary:
            structure = 'summary';
            break;
          case cover:
            structure = 'cover';
            break;
          default:
            structure = 'content';
        }
        newState[r.id] = {
          nodeId: basic.id,
          structure,
          blockId: block.id,
          rewordingId: r.id,
          rewordingLikesCount: r.likes_count,
          isInitialized: true,
        };
      }
    });
  });
  if (hasUpdate) {
    return newState;
  }
  return state;
};

const initWithChunk = (state, action) => {
  const newState = { ...state };
  const { nodeId, blocks } = action.payload;
  Object.values(blocks).forEach((block) => {
    block.rewordings.forEach((r) => {
      newState[r.id] = {
        nodeId,
        structure: 'content',
        blockId: block.id,
        rewordingId: r.id,
        rewordingLikesCount: r.likes_count,
        isInitialized: true,
      };
    });
  });
  return newState;
};

const reducer = (state, action) => {
  // TODO: 分开这两个方法进行数据初始化
  if (action.type === initNodeEdit.SUCCESS) {
    return initWithNodeInit(state, action);
  }
  // TODO: 检查 submitRewording 等数据
  if (
    action.type === loadBlockRange.toString() ||
    action.type === commitBlock.SUCCESS ||
    action.type === submitBlock.SUCCESS ||
    action.type === commitBlock.SUCCESS ||
    action.type === submitMediaBlock.SUCCESS ||
    action.type === commitMediaBlock.SUCCESS
  ) {
    return initWithChunk(state, action);
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
