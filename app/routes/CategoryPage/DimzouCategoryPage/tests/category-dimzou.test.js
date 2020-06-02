import reducer from '../reducer';

import { fetchCategoryFeeds } from '../actions';

const categoryId = 'DEMO'

describe('Category Dimzou Page', () => {
  it('initial state is an object', () => {
    const action = { type: 'DEMO' };
    const state = reducer(undefined, action);
    expect(state).toEqual({});
  });
  
  describe('fetch category feed', () => {
    let state;
    it('request', () => {
      state = reducer(undefined, fetchCategoryFeeds.request({ categoryId }))
      expect(state[categoryId]).toBeTruthy()
      expect(state[categoryId].loading).toBe(true)
    })
  })

});
