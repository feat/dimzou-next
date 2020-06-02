import {
  initLikeWidget,
  likeRewording,
  unlikeRewording,
} from '../actions';

import likesReducer from '../reducers/like';

const NODE_ID = 'NODE_ID';
const BLOCK_ID = 'BLOCK_ID';
const REWORDING_ID = 'REWORDING_ID';

describe('Dimzou Edit -- Rewording Like', () => {
  it('likes reducer init is an object', () => {
    const state = likesReducer(undefined, { type: 'DEMO ' });
    expect(state).toEqual({});
  });

  it('init like widget', () => {
    const action = initLikeWidget({
      nodeId: NODE_ID,
      structure: 'content',
      blockId: BLOCK_ID,
      rewordingId: REWORDING_ID,
      rewordingLikesCount: 3,
    });
    const state = likesReducer(undefined, action);
    expect(state[REWORDING_ID]).toEqual({
      nodeId: NODE_ID,
      structure: 'content',
      blockId: BLOCK_ID,
      rewordingId: REWORDING_ID,
      isInitialized: true,
      rewordingLikesCount: 3,
    });
  });

  describe('like rewording', () => {
    const initAction = initLikeWidget({
      nodeId: 'NODE_ID',
      rewordingId: 'REWORDING_ID',
      rewordingLikesCount: 3,
    });
    const initializedState = likesReducer(undefined, initAction);
    it('request', () => {
      const action = likeRewording.request({
        rewordingId: REWORDING_ID,
      });
      const state = likesReducer(initializedState, action);
      expect(state[REWORDING_ID].isLiking).toBe(true);
    });
    it('fulfill', () => {
      const action = likeRewording.fulfill({
        rewordingId: REWORDING_ID,
      });
      const state = likesReducer(initializedState, action);
      expect(state[REWORDING_ID].isLiking).toBe(false);
    });
  });

  describe('unlike rewording', () => {
    const initAction = initLikeWidget({
      nodeId: 'NODE_ID',
      rewordingId: 'REWORDING_ID',
      rewordingLikesCount: 3,
    });
    const initializedState = likesReducer(undefined, initAction);
    it('request', () => {
      const action = unlikeRewording.request({
        rewordingId: REWORDING_ID,
      });
      const state = likesReducer(initializedState, action);
      expect(state[REWORDING_ID].isUnliking).toBe(true);
    });
    it('fulfill', () => {
      const action = unlikeRewording.fulfill({
        rewordingId: REWORDING_ID,
      });
      const state = likesReducer(initializedState, action);
      expect(state[REWORDING_ID].isUnliking).toBe(false);
    });
  });
});
