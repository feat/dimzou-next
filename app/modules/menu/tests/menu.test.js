import { fetchMenu } from '../actions';

import reducer from '../reducer';

describe('Menu Reducer', () => {
  let state;
  const name = 'MENU';
  describe('fetch menu info', () => {
    it('request', () => {
      state = reducer(
        state,
        fetchMenu.request({
          name,
        }),
      );
      expect(state[name]).toBeTruthy();
      expect(state[name].fetching).toBe(true);
    });
    it('success', () => {
      state = reducer(
        state,
        fetchMenu.success({
          name,
          items: [{ id: 1 }, { id: 2 }],
        }),
      );
      expect(state[name]).toBeTruthy();
      expect(state[name].fetched).toBe(true);
      expect(state[name].items).toEqual([{ id: 1 }, { id: 2 }]);
    });
    it('fulfill', () => {
      state = reducer(
        state,
        fetchMenu.fulfill({
          name,
        }),
      );
      expect(state[name]).toBeTruthy();
      expect(state[name].fetching).toBe(false);
    });
  });
});
