import bundleReducer, { getBundleKey } from '../reducers/bundle';

import {
  registerBundle,
  getCommentTree,
  createComment,
  updateComment,
  deleteComment,
  unregisterBundle,
  bundleInitialized,
} from '../actions';

const basicPayload = {
  entityType: 'type',
  entityId: 'id',
};

describe('Comment Bundle', () => {
  it('bundle state is an object', () => {
    const state = bundleReducer(undefined, { type: 'DEMO' });
    expect(state).toEqual({});
  });
  describe('component register flow', () => {
    let state;
    it('register bundle', () => {
      const action = registerBundle({
        ...basicPayload,
        rootCount: 10,
        channel: 'CHANNEL',
        instanceKey: 'INSTANCE_KEY',
      });
      state = bundleReducer(undefined, action);
      const bundleState = state[getBundleKey(basicPayload)];
      expect(bundleState.rootCount).toEqual(10);
      expect(bundleState.channel).toEqual('CHANNEL');
      expect(bundleState.instances).toBeTruthy();
      expect(bundleState.instances.INSTANCE_KEY).toBeTruthy();
    });
    it('bundle initialized', () => {
      const action = bundleInitialized(basicPayload);
      state = bundleReducer(state, action);
      const bundleState = state[getBundleKey(basicPayload)];
      expect(bundleState.isInitialized).toBeTruthy();
    });
    it('unregister bundle', () => {
      const action = unregisterBundle({
        ...basicPayload,
        instanceKey: 'INSTANCE_KEY',
      });
      state = bundleReducer(state, action);
      const bundleState = state[getBundleKey(basicPayload)];
      expect(bundleState.instances.INSTANCE_KEY).toBeFalsy();
    });
  });

  describe('fetch comment tree', () => {
    let state;
    it('request', () => {
      const action = getCommentTree.request(basicPayload);
      state = bundleReducer(undefined, action);
      const bundleState = state[getBundleKey(basicPayload)];
      expect(bundleState.isFetchingComments).toBe(true);
    });
    it('success', () => {
      const action = getCommentTree.success({
        ...basicPayload,
        list: [2],
        pagination: {
          total_count: 1,
          options: {},
        },
        bundleEntities: {
          users: { 1: { id: 1 } },
          comments: { 2: { id: 2 } },
        },
      });
      state = bundleReducer(state, action);
      const bundleState = state[getBundleKey(basicPayload)];
      expect(bundleState.comments).toContain(2);
      expect(bundleState.rootCount).toEqual(1);
      expect(bundleState.entities).toEqual({
        users: { 1: { id: 1 } },
        comments: { 2: { id: 2 } },
      });
    });
    it('failure', () => {
      const error = new Error('fetch comments error');
      const action = getCommentTree.failure({
        ...basicPayload,
        data: error,
      });
      const errorState = bundleReducer(state, action);
      const bundleState = errorState[getBundleKey(basicPayload)];
      expect(bundleState.fetchCommentsError).toBe(error);
    });
    it('fulfill', () => {
      const action = getCommentTree.fulfill(basicPayload);
      state = bundleReducer(state, action);
      const bundleState = state[getBundleKey(basicPayload)];
      expect(bundleState.isFetchingComments).toBe(false);
    });
  });

  describe('create comment', () => {
    let state;
    it('root comment success', () => {
      const action = createComment.success({
        ...basicPayload,
        commentId: 2,
        bundleEntities: {
          users: { 1: { id: 1 } },
          comments: { 2: { id: 2 } },
        },
      });
      state = bundleReducer(state, action);
      const bundleState = state[getBundleKey(basicPayload)];
      expect(bundleState.comments).toContain(2);
      expect(bundleState.entities).toEqual({
        users: { 1: { id: 1 } },
        comments: { 2: { id: 2 } },
      });
    });
    it('reply comment success', () => {
      const action = createComment.success({
        ...basicPayload,
        commentId: 3,
        parentId: 2,
        bundleEntities: {
          users: { 2: { id: 2 } },
          comments: { 3: { id: 3 } },
        },
      });
      state = bundleReducer(state, action);
      const bundleState = state[getBundleKey(basicPayload)];
      expect(bundleState.comments).not.toContain(3);
    });
  });

  describe('update comment', () => {
    it('success', () => {
      const action = updateComment.success({
        ...basicPayload,
        commentId: 3,
        bundleEntities: {
          users: { 2: { id: 2 } },
          comments: { 3: { id: 3, content: 'updated_content' } },
        },
      });
      const state = bundleReducer(undefined, action);
      const bundleState = state[getBundleKey(basicPayload)];
      expect(bundleState.entities.comments[3].content).toEqual(
        'updated_content',
      );
    });
  });

  describe('delete comment', () => {
    it('delete root comment', () => {
      let state = {
        [getBundleKey(basicPayload)]: {
          comments: [2],
          rootCount: 1,
        },
      };
      const action = deleteComment.success({
        ...basicPayload,
        commentId: 2,
      });
      state = bundleReducer(state, action);
      const bundleState = state[getBundleKey(basicPayload)];
      expect(bundleState.rootCount).toEqual(0);
      expect(bundleState.comments).not.toContain(2);
    });

    it('delete reply comment', () => {
      let state = {
        [getBundleKey(basicPayload)]: {
          comments: [2],
          rootCount: 1,
          entities: {
            comments: {
              2: {
                id: 2,
                children: [3],
              },
              3: {
                id: 3,
              },
            },
          },
        },
      };
      const action = deleteComment.success({
        ...basicPayload,
        commentId: 3,
        parentId: 2,
      });
      state = bundleReducer(state, action);
      const bundleState = state[getBundleKey(basicPayload)];
      expect(bundleState.rootCount).toEqual(1);
      expect(bundleState.entities.comments[2].children).not.toContain(3);
    });
  });
});
