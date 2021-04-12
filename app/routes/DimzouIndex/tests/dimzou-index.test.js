import { fetchCategories, fetchCategoryFeed } from '../actions';
import { provider } from '../helpers';
import reducer from '../reducer';

describe('Dimzou Index', () => {
  describe('fetchCategoryFeed', () => {
    let state;
    it('trigger', () => {
      const action = fetchCategoryFeed({ categoryId: 'ID' });
      state = reducer(state, action);
      const mapState = state.sections;
      expect(mapState.ID).toBeTruthy();
    });
    it('request', () => {
      const action = fetchCategoryFeed.request({ categoryId: 'ID' });
      state = reducer(state, action);
      const mapState = state.sections;
      expect(mapState.ID).toBeTruthy();
      expect(mapState.ID.loading).toBeTruthy();
    });
    it('failure', () => {
      const error = new Error('Failed');
      const action = fetchCategoryFeed.failure({
        categoryId: 'ID',
        data: error,
      });
      const failedState = reducer(state, action);
      const mapState = failedState.sections;
      const blockState = mapState.ID;
      expect(blockState.error).toBe(error);
      expect(blockState.onceFetched).toBe(true);
    });
    it('success', () => {
      const action = fetchCategoryFeed.success({
        categoryId: 'ID',
        data: {
          items: [{ id: 1 }, { id: 2 }],
          template: 'II',
        },
      });
      state = reducer(state, action);
      const mapState = state.sections;
      const blockState = mapState.ID;
      expect(blockState.data).toEqual({
        items: [{ id: 1 }, { id: 2 }],
        template: 'II',
      });
      expect(blockState.onceFetched).toBe(true);
    });

    it('fulfill', () => {
      const action = fetchCategoryFeed.fulfill({ categoryId: 'ID' });
      state = reducer(state, action);
      const mapState = state.sections;
      expect(mapState.ID).toBeTruthy();
      expect(mapState.ID.loading).toBeFalsy();
    });
  });

  describe('fetchCategories', () => {
    let state;
    it('trigger', () => {
      const action = fetchCategories();
      state = reducer(state, action);
      const blockState = state.category;
      expect(blockState).toBeTruthy();
    });
    it('request', () => {
      const action = fetchCategories.request();
      state = reducer(state, action);
      const blockState = state.category;
      expect(blockState.loading).toBeTruthy();
    });
    it('failure', () => {
      const error = new Error('Failed');
      const action = fetchCategories.failure(error);
      const failedState = reducer(state, action);
      const blockState = failedState.category;
      expect(blockState.error).toBe(error);
    });
    it('success', () => {
      const data = {};
      const action = fetchCategories.success(data);
      state = reducer(state, action);
      const blockState = state.category;
      expect(blockState.data).toBe(data);
    });
    it('fulfill', () => {
      const action = fetchCategories.fulfill();
      state = reducer(state, action);
      const blockState = state.category;
      expect(blockState).toBeTruthy();
      expect(blockState.loading).toBeFalsy();
    });
  });

  it('provider getTemplates', () => {
    [1, 2, 3, 4, 5, 6, 7].forEach((count) => {
      const items = provider.getTemplates(count);
      expect(items).toBeTruthy();
      expect(typeof items[0]).toEqual('string');
      // for (let i = 0; i < 100; i += 1) {
      //   const items = provider.getTemplates(count);
      //   const resultCount = items.reduce((a, b) => a + b.count, 0);
      //   expect(resultCount).toEqual(count);
      // }
    });
  });
});
