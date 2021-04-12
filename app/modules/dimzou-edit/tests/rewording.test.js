import {
  initRewordingEdit,
  exitRewordingEdit,
  updateRewordingEditor,
  openCommentPanel,
  closeCommentPanel,
  submitRewording,
  updateRewording,
  commitRewording,
  // submitMediaRewording,
  commitMediaRewording,
} from '../actions';

import { createEmpty } from '../components/DimzouEditor';
import rewordingReducer from '../reducers/rewording';

const REWORDING_ID = 'REWORDING_ID';

describe('Dimzou Edit -- Rewording', () => {
  const rewordingsState = rewordingReducer(undefined, { type: 'DEMO' });
  it('appendings initial state is an object', () => {
    expect(rewordingsState).toEqual({});
  });

  it('init rewording edit', () => {
    const action = initRewordingEdit({
      rewordingId: REWORDING_ID,
      editorState: createEmpty(),
    });
    const state = rewordingReducer(rewordingsState, action);
    const rewordingState = state[REWORDING_ID];
    expect(rewordingState).toBeTruthy();
    expect(rewordingState.isEditModeEnabled).toBe(true);
  });

  it('update rewording editor', () => {
    const editorState = createEmpty();
    const action = updateRewordingEditor({
      rewordingId: REWORDING_ID,
      editorState,
    });
    const state = rewordingReducer(rewordingsState, action);
    expect(state[REWORDING_ID].editorState).toEqual(editorState);
  });

  it('exit rewording edit', () => {
    const action = exitRewordingEdit({
      rewordingId: REWORDING_ID,
    });
    const state = rewordingReducer(rewordingsState, action);
    const rewordingState = state[REWORDING_ID];
    expect(rewordingState.isEditModeEnabled).toBe(false);
  });

  describe('commit rewording', () => {
    let state;
    const initiAction = initRewordingEdit({
      rewordingId: REWORDING_ID,
      editorState: createEmpty(),
    });
    state = rewordingReducer(rewordingsState, initiAction);
    it('request', () => {
      const action = commitRewording.request({
        rewordingId: REWORDING_ID,
        baseId: REWORDING_ID,
        trigger: 'rewording',
      });
      state = rewordingReducer(state, action);
      const rewordingState = state[REWORDING_ID];
      expect(rewordingState.submitting).toBe(true);
    });

    it('success', () => {
      const action = commitRewording.success({
        rewordingId: REWORDING_ID,
        baseId: REWORDING_ID,
        trigger: 'rewording',
      });
      state = rewordingReducer(state, action);
      const rewordingState = state[REWORDING_ID];
      expect(rewordingState.isEditModeEnabled).toBe(false);
    });

    it('fulfill', () => {
      const action = commitRewording.fulfill({
        rewordingId: REWORDING_ID,
        baseId: REWORDING_ID,
        trigger: 'rewording',
      });
      state = rewordingReducer(state, action);
      const rewordingState = state[REWORDING_ID];
      expect(rewordingState.submitting).toBe(false);
    });
  });

  describe('submit rewording', () => {
    let state;
    const initAction = initRewordingEdit({
      rewordingId: REWORDING_ID,
      editorState: createEmpty(),
    });
    state = rewordingReducer(rewordingsState, initAction);
    it('request', () => {
      const action = submitRewording.request({
        rewordingId: REWORDING_ID,
        baseId: REWORDING_ID,
        trigger: 'rewording',
      });
      state = rewordingReducer(state, action);
      const rewordingState = state[REWORDING_ID];

      expect(rewordingState.submitting).toBe(true);
    });

    it('success', () => {
      const action = submitRewording.success({
        rewordingId: REWORDING_ID,
        baseId: REWORDING_ID,
        trigger: 'rewording',
      });
      state = rewordingReducer(state, action);
      const rewordingState = state[REWORDING_ID];

      expect(rewordingState.isEditModeEnabled).toBe(false);
    });

    it('fulfill', () => {
      const action = submitRewording.fulfill({
        rewordingId: REWORDING_ID,
        baseId: REWORDING_ID,
        trigger: 'rewording',
      });
      state = rewordingReducer(rewordingsState, action);
      const rewordingState = state[REWORDING_ID];
      expect(rewordingState.submitting).toBe(false);
    });
  });

  describe('update rewording', () => {
    let state;
    const initAction = initRewordingEdit({
      rewordingId: REWORDING_ID,
      editorState: createEmpty(),
    });
    state = rewordingReducer(rewordingsState, initAction);
    it('request', () => {
      const action = updateRewording.request({
        rewordingId: REWORDING_ID,
        trigger: 'rewording',
      });
      state = rewordingReducer(state, action);
      const rewordingState = state[REWORDING_ID];
      expect(rewordingState.submitting).toBe(true);
    });

    it('success', () => {
      const action = updateRewording.success({
        rewordingId: REWORDING_ID,
        trigger: 'rewording',
      });
      state = rewordingReducer(state, action);
      const rewordingState = state[REWORDING_ID];
      expect(rewordingState.isEditModeEnabled).toBe(false);
    });

    it('fulfill', () => {
      const action = updateRewording.fulfill({
        rewordingId: REWORDING_ID,
        trigger: 'rewording',
      });
      state = rewordingReducer(state, action);
      const rewordingState = state[REWORDING_ID];
      expect(rewordingState.submitting).toBe(false);
    });
  });

  describe('comment panel', () => {
    let state;
    it('open', () => {
      const action = openCommentPanel({ rewordingId: REWORDING_ID });
      state = rewordingReducer(undefined, action);
      const rewordingState = state[REWORDING_ID];
      expect(rewordingState.isCommentPanelOpened).toBe(true);
    });
    it('close', () => {
      const action = closeCommentPanel({ rewordingId: REWORDING_ID });
      state = rewordingReducer(undefined, action);
      const rewordingState = state[REWORDING_ID];
      expect(rewordingState.isCommentPanelOpened).toBe(false);
    });
  });

  describe('addMediaRewording', () => {
    let state;
    it('trigger', () => {
      const file = {};
      const payload = {
        rewordingId: REWORDING_ID,
        file,
        trigger: 'rewording',
      };
      const action = commitMediaRewording(payload);
      state = rewordingReducer(state, action);
      const rewordingState = state[REWORDING_ID];
      expect(rewordingState.isSubmittingFile).toBe(true);
      expect(rewordingState.fileSubmitting).toBe(file);
    });
    it('success', () => {
      const file = {};
      const payload = {
        rewordingId: REWORDING_ID,
        file,
        trigger: 'rewording',
      };
      const action = commitMediaRewording.success(payload);
      state = rewordingReducer(state, action);
      const rewordingState = state[REWORDING_ID];
      expect(rewordingState.fileSubmitting).toBe(null);
    });
    it('fulfill', () => {
      const payload = {
        rewordingId: REWORDING_ID,
        trigger: 'rewording',
      };
      const action = commitMediaRewording.fulfill(payload);
      state = rewordingReducer(state, action);
      const rewordingState = state[REWORDING_ID];
      expect(rewordingState.isSubmittingFile).toBe(false);
    });
  });
});
