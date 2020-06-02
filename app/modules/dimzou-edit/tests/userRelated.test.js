import reducer from '../reducers/userRelated';
import { separateChapterPatch, newBundlePatch } from '../actions';

describe('user related reducer', () =>{
  const intiState = {
    'USER_ID': {
      onceFetched: true,
      data: [ 1, 2, 3, 4, 5, 6 ], // id array
      next: null,
      error: null,
      loading: false,
      loaded: [1, 2, 3, 4], // id array
      ids: { 1: true, 2: true, 3: true, 4: true },
    }, 
  };
  // it ('bundle merged', () => {
  //   const state = reducer(intiState, mergeBundlePatch({
  //     userId: 'USER_ID', 
  //     mergedBundleId: 1,
  //     nodeId: 10,
  //     targetBundleId: 3,
  //   }))
  //   expect(state.USER_ID.ids[1]).toBeFalsy();
  //   expect(state.USER_ID.loaded).not.toContain(1);
  //   expect(state.USER_ID.data).not.toContain(1);
  // })

  it ('separate chapter', () => {
    const state = reducer(intiState, separateChapterPatch({
      userId: 'USER_ID',
      nodeId: 1,
      bundleId: 10,
    }))
    expect(state.USER_ID.ids[10]).toBeTruthy();
    expect(state.USER_ID.loaded).toContain(10);
    expect(state.USER_ID.data).toContain(10);
  })

  it ('new bundle', () => {
    const state = reducer(intiState, newBundlePatch({
      userId: 'USER_ID',
      nodeId: 1,
      bundleId: 10,
    }))
    expect(state.USER_ID.ids[10]).toBeTruthy();
    expect(state.USER_ID.loaded).toContain(10);
    expect(state.USER_ID.data).toContain(10);
  })
})