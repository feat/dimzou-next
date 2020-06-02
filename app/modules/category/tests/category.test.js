import { fetchUserCategories, createCategory } from '../actions';

import reducer from '../reducer';

describe('category module', () => {
  let state;
  describe('fetch user category', () => {
    let failureState;
    it('request', () => {
      const action = fetchUserCategories.request();
      state = reducer(state, action);
      expect(state.isFetchingUserCategories).toBe(true);
    });
    it('success', () => {
      const action = fetchUserCategories.success({
        list: [1, 2, 3, 4],
      });
      state = reducer(state, action);
      expect(state.userCategories).toEqual([1, 2, 3, 4]);
    });
    it('failure', () => {
      const err = new Error('FETCH ERROR');
      const action = fetchUserCategories.failure(err);
      failureState = reducer(state, action);
      expect(failureState.userCategoriesError).toBe(err);
    });
    it('trigger', () => {
      const action = fetchUserCategories();
      const resetState = reducer(failureState, action);
      expect(resetState.userCategoriesError).toBe(null);
    });
    it('fulfill', () => {
      const action = fetchUserCategories.fulfill();
      state = reducer(state, action);
      expect(state.isFetchingUserCategories).toBe(false);
    });
  });
  describe('create category', () => {
    it('success', () => {
      const action = createCategory.success({
        categoryId: 6,
      });
      state = reducer(state, action);
      expect(state.userCategories).toContain(6);
    });
  });
});
