import {
  initLikeWidget,
  likeRewording,
  unlikeRewording,
  initNodeEdit,
  loadBlockRange,
  commitBlock,
  submitBlock,
  commitMediaBlock,
  submitMediaBlock,
} from '../actions';

import likesReducer from '../reducers/like';

const NODE_ID = 'NODE_ID';
const BLOCK_ID = 'BLOCK_ID';
const REWORDING_ID = 'REWORDING_ID';

describe('Dimzou Edit -- Rewording Like', () => {
  it('likes reducer init is an object', () => {
    const state = likesReducer(undefined, { type: 'DEMO' });
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

  describe('bulk init', () => {
    it('init with node init', () => {
      // TODO
      const action = initNodeEdit.success({
        bundleId: 1,
        nodeId: 1,
        basic: { id: 1, bundle_id: 1 },
        title: 2,
        blocks: {
          2: {
            id: 2,
            rewordings: [
              {
                id: 'rewording-1',
                likes_count: 2,
              },
            ],
          },
        },
      });
      const state = likesReducer({}, action);
      expect(state['rewording-1']).toBeTruthy();
    });

    it('init for block chunk', () => {
      // TODO
      const action = loadBlockRange({
        nodeId: 1,
        blocks: {
          2: {
            id: 2,
            rewordings: [
              {
                id: 'rewording-1',
                likes_count: 2,
              },
            ],
          },
        },
      });
      const state = likesReducer({}, action);
      expect(state['rewording-1']).toBeTruthy();
    });

    it('init for commitBlock.success', () => {
      const action = commitBlock.success({
        nodeId: 1,
        blockList: [2],
        blocks: {
          2: {
            id: 2,
            rewordings: [
              {
                id: 'rewording-1',
                likes_count: 2,
              },
            ],
          },
        },
      });
      const state = likesReducer({}, action);
      expect(state['rewording-1']).toBeTruthy();
    });
    it('init for submitBlock.success', () => {
      const action = submitBlock.success({
        nodeId: 1,
        blockList: [2],
        blocks: {
          2: {
            id: 2,
            rewordings: [
              {
                id: 'rewording-1',
                likes_count: 2,
              },
            ],
          },
        },
      });
      const state = likesReducer({}, action);
      expect(state['rewording-1']).toBeTruthy();
    });

    it('init for commitMediaBlock.success', () => {
      const action = commitMediaBlock.success({
        nodeId: 1,
        blockList: [2],
        blocks: {
          2: {
            id: 2,
            rewordings: [
              {
                id: 'rewording-1',
                likes_count: 2,
              },
            ],
          },
        },
      });
      const state = likesReducer({}, action);
      expect(state['rewording-1']).toBeTruthy();
    });

    it('init for submitMediaBlock.success', () => {
      const action = submitMediaBlock.success({
        nodeId: 1,
        blockList: [2],
        blocks: {
          2: {
            id: 2,
            rewordings: [
              {
                id: 'rewording-1',
                likes_count: 2,
              },
            ],
          },
        },
      });
      const state = likesReducer({}, action);
      expect(state['rewording-1']).toBeTruthy();
    });
  });
});
