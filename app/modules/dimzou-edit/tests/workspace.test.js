import workspaceReducer from '../reducers/workspace';
import {
  initCreateChapter,
  exitCreateChapter,
  initCreateCover,
  exitCreateCover,
  createCopyBundle,
} from '../actions';

describe('Dimzou workspace', () => {
  describe('create chapter', () => {
    let state;
    it('init create chapter', () => {
      const action = initCreateChapter({
        bundleId: 1,
      });
      state = workspaceReducer(undefined, action);
      expect(state.isChapterCreationPanelOpened).toBe(true);
      expect(state.chapterCreationContext).toEqual({
        bundleId: 1,
      });
    });

    it('cancel create chapter', () => {
      const action = exitCreateChapter();
      state = workspaceReducer(state, action);
      expect(state.isChapterCreationPanelOpened).toBe(false);
      expect(state.chapterCreationContext).toBe(null);
    });

    // TODO create request
  });

  describe('create cover', () => {
    let state;
    it('init create cover', () => {
      const action = initCreateCover();
      state = workspaceReducer(undefined, action);
      expect(state.isCoverCreationPanelOpened).toBe(true);
    });
    it('exit create cover', () => {
      const action = exitCreateCover();
      state = workspaceReducer(state, action);
      expect(state.isCoverCreationPanelOpened).toBe(false);
    });
  });

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
  })

  describe('share(invitation)', () => {

  });

  describe('release', () => {

  });
})