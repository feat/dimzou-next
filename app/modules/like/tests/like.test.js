import { initWidget, createLike, deleteLike, likeSignal } from '../actions';

import reducer, { getWidgetKey } from '../reducer';

const ENTITY_TYPE = 100;
const ENITTY_ID = 1;

describe('Like Widget', () => {
  let state;
  it('init Widget', () => {
    const payload = initWidget({
      entityType: ENTITY_TYPE,
      entityId: ENITTY_ID,
      initialData: {
        likes: [],
        likesCount: 10,
        userHasLiked: false,
      },
    });
    const key = getWidgetKey({
      entityType: ENTITY_TYPE,
      entityId: ENITTY_ID,
    });
    state = reducer(state, payload);
    const widgetState = state[key];
    expect(widgetState).toBeTruthy();
    expect(widgetState.isInitialized).toBe(true);
    expect(widgetState.likes).toEqual([]);
    expect(widgetState.likesCount).toEqual(10);
    expect(widgetState.userHasLiked).toBe(false);
  });

  describe('create like', () => {
    it('trigger', () => {});
    it('request', () => {});
    it('success', () => {
      const payload = {
        entityType: ENTITY_TYPE,
        entityId: ENITTY_ID,
        id: 'NEW_ITEM',
        entities: {},
      };
      const action = createLike.success(payload);
      const key = getWidgetKey(payload);
      state = reducer(state, action);
      const widgetState = state[key];

      expect(widgetState.userHasLiked).toBe(true);
      expect(widgetState.likes).toContain('NEW_ITEM');
    });
    it('failure', () => {});
    it('fulfill', () => {});
  });

  describe('delete like', () => {
    it('trigger', () => {});
    it('request', () => {});
    it('success', () => {
      const payload = {
        entityType: ENTITY_TYPE,
        entityId: ENITTY_ID,
        id: 'NEW_ITEM',
        entities: {},
      };
      const action = deleteLike.success(payload);
      state = reducer(state, action);
      const key = getWidgetKey(payload);
      const widgetState = state[key];
      expect(widgetState.userHasLiked).toBe(false);
      expect(widgetState.likes).not.toContain('NEW_ITEM');
    });
    it('failure', () => {});
    it('fulfill', () => {});
  });

  describe('like signal', () => {
    it('handle created, isCurrentUserLike', () => {
      const payload = {
        id: 'SIGNAL',
        status: 'created',
        entityType: 'DEMO',
        entityId: 'ANOTHER',
        isCurrentUserLike: true,
      };
      const action = likeSignal(payload);
      state = reducer(state, action);
      const key = getWidgetKey(payload);
      const widgetState = state[key];

      expect(widgetState.likesCount).toEqual(1);
      expect(widgetState.likes).toContain('SIGNAL');
      expect(widgetState.userHasLiked).toBe(true);
    });
    it('handle created, not isCurrentUserLike, hasLiked', () => {
      const payload = {
        id: 'OTHER_SIGNAL',
        status: 'created',
        entityType: 'DEMO',
        entityId: 'ANOTHER',
        isCurrentUserLike: false,
      };
      const action = likeSignal(payload);
      state = reducer(state, action);
      const key = getWidgetKey(payload);
      const widgetState = state[key];

      expect(widgetState.likesCount).toEqual(2);
      expect(widgetState.likes).toContain('OTHER_SIGNAL');
      expect(widgetState.userHasLiked).toBe(true);
    });
    it('handle created, not isCurrentUserLike, not hasLiked', () => {
      const payload = {
        id: 'OTHER_SIGNAL',
        status: 'created',
        entityType: 'DEMO',
        entityId: 'NOT_LIKED',
        isCurrentUserLike: false,
      };
      const action = likeSignal(payload);
      state = reducer(state, action);
      const key = getWidgetKey(payload);
      const widgetState = state[key];

      expect(widgetState.likesCount).toEqual(1);
      expect(widgetState.likes).toContain('OTHER_SIGNAL');
      expect(widgetState.userHasLiked).toBe(false);
    });
    it('handle deleted, isCurrentUserLike, hasLiked', () => {
      const payload = {
        id: 'SIGNAL',
        status: 'deleted',
        entityType: 'DEMO',
        entityId: 'ANOTHER',
        isCurrentUserLike: true,
      };

      const action = likeSignal(payload);
      state = reducer(state, action);
      const key = getWidgetKey(payload);
      const widgetState = state[key];

      expect(widgetState.likesCount).toEqual(1);
      expect(widgetState.likes).not.toContain('SIGNAL');
      expect(widgetState.userHasLiked).toBe(false);
    });
    it('handle deleted, not isCurrentUserLike, hasLiked', () => {
      const payload = {
        id: 'OTHER_SIGNAL',
        status: 'deleted',
        entityType: 'DEMO',
        entityId: 'ANOTHER',
        isCurrentUserLike: false,
      };

      const action = likeSignal(payload);
      state = reducer(state, action);
      const key = getWidgetKey(payload);
      const widgetState = state[key];

      expect(widgetState.likesCount).toEqual(0);
      expect(widgetState.likes).not.toContain('OTHER_SIGNAL');
      expect(widgetState.userHasLiked).toBe(false);
    });
  });
});
