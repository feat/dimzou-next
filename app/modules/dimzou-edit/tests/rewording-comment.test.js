import { rewordingComment as rewordingCommentSchema } from '../schema';
import {
  registerRewordingCommentBundle,
  initRewordingCommentBundle,
  fetchRewordingCommentTree,
  createRewordingComment,
  increaseRootCount,
  decreaseRootCount,
  deleteRewordingComment,
  initNodeEdit,
  loadBlockRange,
  commitBlock,
  submitBlock,
  commitMediaBlock,
  submitMediaBlock,
} from '../actions';

import commentsReducer from '../reducers/comment';

const REWORDING_ID = 'REWORDING_ID';
const NODE_ID = 'NODE_ID';
const COMMENT_ID = 'COMMENT_ID';

describe('Dimzou Edit -- Rewording Comment', () => {
  it('rewordings comment state is an object', () => {
    const state = commentsReducer(undefined, { type: 'DEMO' });
    expect(state).toEqual({});
  });

  it('register comment bundle', () => {
    const action = registerRewordingCommentBundle({
      nodeId: NODE_ID,
      rewordingId: REWORDING_ID,
      rootCount: 10,
    });
    const state = commentsReducer(undefined, action);
    const bundleState = state[REWORDING_ID];
    expect(bundleState).toBeTruthy();
    expect(bundleState.rootCount).toEqual(10);
  });

  it('init comment bundle', () => {
    const action = initRewordingCommentBundle({
      nodeId: NODE_ID,
      rewordingId: REWORDING_ID,
    });
    const state = commentsReducer(undefined, action);
    const bundleState = state[REWORDING_ID];
    expect(bundleState.isInitialized).toBe(true);
  });

  describe('fetch comment tree', () => {
    const initAction = initRewordingCommentBundle({
      nodeId: NODE_ID,
      rewordingId: REWORDING_ID,
      rootCount: 10,
    });
    const initialized = commentsReducer(undefined, initAction);
    let state;
    it('request', () => {
      const action = fetchRewordingCommentTree.request({
        rewordingId: REWORDING_ID,
      });
      state = commentsReducer(initialized, action);
      const bundleState = state[REWORDING_ID];
      expect(bundleState.isFetchingComments).toBe(true);
    });
    it('success', () => {
      const action = fetchRewordingCommentTree.success({
        rewordingId: REWORDING_ID,
        list: [1, 2],
        pagination: {
          options: {
            next: { page_size: 2, page: 2 },
          },
          total_count: 10,
        },
        bundleEntities: {
          dimzouRewordingComments: {
            1: { id: 1, content: 'comment -1' },
            2: { id: 2, content: 'comment -2' },
          },
        },
      });
      state = commentsReducer(state, action);
      const bundleState = state[REWORDING_ID];
      expect(bundleState.entities.dimzouRewordingComments[1]).toEqual({
        id: 1,
        content: 'comment -1',
      });
      expect(bundleState.pagination).toEqual({
        options: {
          next: { page_size: 2, page: 2 },
        },
        total_count: 10,
      });
    });
    it('fulfill', () => {
      const action = fetchRewordingCommentTree.fulfill({
        rewordingId: REWORDING_ID,
      });
      state = commentsReducer(initialized, action);
      const bundleState = state[REWORDING_ID];

      expect(bundleState.isFetchingComments).toBe(false);
    });
  });

  it('create comment success', () => {
    const initAction = registerRewordingCommentBundle({
      nodeId: NODE_ID,
      rewordingId: REWORDING_ID,
      rootCount: 10,
    });
    const initialized = commentsReducer(undefined, initAction);
    const action = createRewordingComment.success({
      rewordingId: REWORDING_ID,
      commentId: COMMENT_ID,
      bundleEntities: {
        dimzouRewordingComments: {
          [COMMENT_ID]: {
            id: COMMENT_ID,
            content: 'comment created',
          },
        },
      },
    });
    const state = commentsReducer(initialized, action);
    const bundleState = state[REWORDING_ID];
    expect(bundleState).toBeTruthy();
    expect(bundleState.comments).toBeTruthy();
    expect(bundleState.comments).toContain(COMMENT_ID);
    expect(bundleState.rootCount).toEqual(11);
  });

  it('create comment success, reply', () => {
    // TODO:
    const initialized = {
      [REWORDING_ID]: {
        isInitialized: true,
        comments: [10],
        rootCount: 1,
        entities: {
          [rewordingCommentSchema.key]: {
            10: {
              id: 10,
              children: [],
            },
          },
        },
      },
    };
    const action = createRewordingComment.success({
      rewordingId: REWORDING_ID,
      commentId: COMMENT_ID,
      parentId: 10,
      bundleEntities: {
        [rewordingCommentSchema.key]: {
          [COMMENT_ID]: {
            id: COMMENT_ID,
            content: 'comment created',
          },
        },
      },
    });
    const state = commentsReducer(initialized, action);
    const bundleState = state[REWORDING_ID];
    expect(bundleState).toBeTruthy();
    expect(bundleState.comments).toBeTruthy();
    expect(bundleState.rootCount).toBe(1);
    expect(
      bundleState.entities[rewordingCommentSchema.key][10].children,
    ).toContain(COMMENT_ID);
  });

  describe('update comment', () => {});

  describe('delete comment', () => {
    it('delete root comment', () => {
      const initialized = {
        [REWORDING_ID]: {
          isInitialized: true,
          comments: [10],
          rootCount: 1,
          entities: {
            [rewordingCommentSchema.key]: {
              10: {
                id: 10,
                children: [],
              },
            },
          },
        },
      };
      const action = deleteRewordingComment.success({
        rewordingId: REWORDING_ID,
        commentId: 10,
        parentId: null,
      });
      const state = commentsReducer(initialized, action);
      const bundleState = state[REWORDING_ID];
      expect(bundleState).toBeTruthy();
      expect(bundleState.rootCount).toBe(0);
      expect(bundleState.entities[rewordingCommentSchema.key][10]).toBeFalsy();
    });

    it('delete sub comment', () => {
      const initialized = {
        [REWORDING_ID]: {
          isInitialized: true,
          comments: [10],
          rootCount: 1,
          entities: {
            [rewordingCommentSchema.key]: {
              10: {
                id: 10,
                children: [11],
              },
              11: {
                id: 11,
              },
            },
          },
        },
      };
      const action = deleteRewordingComment.success({
        rewordingId: REWORDING_ID,
        commentId: 11,
        parentId: 10,
      });
      const state = commentsReducer(initialized, action);
      const bundleState = state[REWORDING_ID];
      expect(bundleState).toBeTruthy();
      expect(bundleState.rootCount).toBe(1);
      expect(
        bundleState.entities[rewordingCommentSchema.key][10].children.length,
      ).toBe(0);
      expect(bundleState.entities[rewordingCommentSchema.key][11]).toBeFalsy();
    });
  });

  describe('broadcasting', () => {
    const initAction = registerRewordingCommentBundle({
      nodeId: NODE_ID,
      rewordingId: REWORDING_ID,
      rootCount: 10,
    });
    const initState = commentsReducer(undefined, initAction);
    it('increase root count', () => {
      const action = increaseRootCount({ rewordingId: REWORDING_ID });
      const state = commentsReducer(initState, action);
      const bundleState = state[REWORDING_ID];
      expect(bundleState.rootCount).toEqual(11);
    });

    it('decrease root count', () => {
      const action = decreaseRootCount({ rewordingId: REWORDING_ID });
      const state = commentsReducer(initState, action);
      const bundleState = state[REWORDING_ID];
      expect(bundleState.rootCount).toEqual(9);
    });
  });

  describe('bulk init', () => {
    it('init with node init', () => {
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
                comments_count: 0,
              },
            ],
          },
        },
      });
      const state = commentsReducer({}, action);
      expect(state['rewording-1']).toBeTruthy();
    });

    it('init for block thunk', () => {
      const action = loadBlockRange({
        nodeId: 1,
        blocks: {
          2: {
            id: 2,
            rewordings: [
              {
                id: 'rewording-1',
                comments_count: 0,
              },
            ],
          },
        },
      });
      const state = commentsReducer({}, action);
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
                comments_count: 0,
              },
            ],
          },
        },
      });
      const state = commentsReducer({}, action);
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
                comments_count: 0,
              },
            ],
          },
        },
      });
      const state = commentsReducer({}, action);
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
                comments_count: 0,
              },
            ],
          },
        },
      });
      const state = commentsReducer({}, action);
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
                comments_count: 0,
              },
            ],
          },
        },
      });
      const state = commentsReducer({}, action);
      expect(state['rewording-1']).toBeTruthy();
    });
  });
});
