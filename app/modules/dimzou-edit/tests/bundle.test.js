import {
  initBundle,
  loadBundleEditInfo,
  fetchBundleEditInfo,
  fetchBundleEditInfoFailure,
  // receiveNewNode,
  // receiveNodeDescInfo,
  // addCollaborator,
} from '../actions';
import { bundle as bundleData } from './demo-data';

import bundleReducer, { initialBundleState } from '../reducers/bundle';

const BUNDLE_ID = 'BUNDLE_ID';

describe('Dimzou Bundle', () => {
  let initialBundlesState;
  it('initial state is an object', () => {
    const intialState = bundleReducer(undefined, { type: undefined });
    expect(intialState).toEqual({});
  });
  it('init bundle', () => {
    const action = initBundle({ bundleId: BUNDLE_ID });
    const state = bundleReducer(undefined, action);
    initialBundlesState = state;
    expect(state[BUNDLE_ID]).toEqual({
      ...initialBundleState,
      invitationCode: undefined,
    });
  });
  it('fetch bundle edit info', () => {
    const action = fetchBundleEditInfo({
      bundleId: BUNDLE_ID,
    });
    const state = bundleReducer(initialBundlesState, action);
    expect(state[BUNDLE_ID].isFetchingEditInfo).toBeTruthy();
  });
  it('load bundle data', () => {
    const action = loadBundleEditInfo({
      bundleId: BUNDLE_ID,
      data: bundleData,
    });
    const state = bundleReducer(initialBundlesState, action);
    initialBundlesState = state;
    const bundleState = state[BUNDLE_ID];
    // expect(bundleState.data).toEqual(bundleData);
    expect(bundleState.isFetchingEditInfo).toBeFalsy();
  });
  it('fetch edit info failure', () => {
    const fetchError = new Error('fetch error');
    const action = fetchBundleEditInfoFailure({
      bundleId: BUNDLE_ID,
      data: fetchError,
    });
    const state = bundleReducer(initialBundlesState, action);
    const bundleState = state[BUNDLE_ID];
    expect(bundleState.isFetchingEditInfo).toBeFalsy();
    expect(bundleState.fetchError).toEqual(fetchError);
  });


  // describe('add collaborators', () => {
  //   let prevState
  //   let demoUser = {uid: 1, username: 'demo'};
  //   it('add collaborator', () => {
  //     const action = addCollaborator(BUNDLE_ID, demoUser);
  //     const state = bundleReducer(initialBundlesState, action);
  //     const bundleState = state[BUNDLE_ID];
  //     prevState = state;
  //     expect(bundleState.cachedNewCollaborators).toContainEqual({
  //       user: demoUser
  //     });
  //   })
  //   it('add collaborators success', () => {
  //     const action = addCollaborator(BUNDLE_ID, {
  //       user_id: 1,
  //     });
  //     const state = bundleReducer(prevState, action);
  //     const bundleState = state[BUNDLE_ID];
  //     expect(bundleState.cachedNewCollaborators).not.toContainEqual({
  //       user: demoUser
  //     });
  //   })
  // });

  // describe('update collaborators', () => {
  //   expect(true).toBe(false);
  // });
});
