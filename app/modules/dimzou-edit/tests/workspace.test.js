import workspaceReducer from '../reducers/workspace';
import { createCopyBundle, initBlockEdit, exitBlockEdit } from '../actions';

describe('Dimzou workspace', () => {
  describe('createCopyBundle', () => {
    let state;
    it('request', () => {
      const action = createCopyBundle.request({ bundleId: 'DEMO' });
      state = workspaceReducer(undefined, action);
      expect(state.requests['copy_bundle.DEMO']).toBe(true);
    });
    it('fulfill', () => {
      const action = createCopyBundle.fulfill({ bundleId: 'DEMO' });
      state = workspaceReducer(undefined, action);
      expect(state.requests['copy_bundle.DEMO']).toBe(false);
    });
  });

  describe('isEditingCover update', () => {
    let state;
    it('initBlockEdit', () => {
      const action = initBlockEdit({ structure: 'cover' });
      state = workspaceReducer(undefined, action);
      expect(state.isEditingCover).toBe(true);
    });
    it('exitBlockEdit', () => {
      const action = exitBlockEdit({ structure: 'cover' });
      state = workspaceReducer(undefined, action);
      expect(state.isEditingCover).toBe(false);
    });
  });

  describe('share(invitation)', () => {});

  describe('release', () => {});
});
