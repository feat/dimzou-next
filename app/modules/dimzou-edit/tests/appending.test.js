import get from 'lodash/get';
import update from 'immutability-helper';

import { 
  loadNodeEditInfo, 
  submitBlock, 
  commitBlock,

  createAppendBlock,
  updateAppendBlock,
  removeAppendBlock,
} from '../actions';

import appendingReducer, { getAppendingKey } from '../reducers/appending';
import { TAILING_PIVOT } from '../constants';

import { createFromHTML } from '../components/DimzouEditor';

const BUNDLE_ID = 'BUNDLE_ID';
const NODE_ID = 'NODE_ID';
const PIVOT_ID = 'PIVOT_ID';

describe('appendings', () => {
  const appendingsState = appendingReducer(undefined, { type: 'DEMO' });
  it('appendings initial state is a map', () => {
    expect(appendingsState).toEqual({});
  });

  it('create tailing append block when loading edit info', () => {
    const payload = {
      bundleId: BUNDLE_ID,
      nodeId: NODE_ID,
      data: {
        content: [],
      },
    };
    const action = loadNodeEditInfo(payload);
    const state = appendingReducer(appendingsState, action);
    const key = getAppendingKey(payload);
    expect(get(state, [key, TAILING_PIVOT])).toBeTruthy();
  });

  it('create append block', () => {
    const blockInfo = {
      bundleId: BUNDLE_ID,
      nodeId: NODE_ID,
      pivotId: PIVOT_ID,
      type: 'editor',
      editorState: 'EDITOR',
    };
    const action = createAppendBlock(blockInfo);
    const state = appendingReducer(appendingsState, action);
    const key = getAppendingKey(blockInfo);
    expect(get(state, [key, String(PIVOT_ID)])).toEqual(blockInfo);
  });

  it('update append block', () => {
    const blockInfo = {
      bundleId: BUNDLE_ID,
      nodeId: NODE_ID,
      pivotId: PIVOT_ID,
      type: 'editor',
      editorState: 'EDITOR',
    };
    const action = updateAppendBlock(blockInfo);
    const state = appendingReducer(appendingsState, action);
    const key = getAppendingKey(blockInfo);
    expect(get(state, [key, String(PIVOT_ID)])).toEqual(blockInfo);
  });

  it('remove append block', () => {
    const blockInfo = {
      bundleId: BUNDLE_ID,
      nodeId: NODE_ID,
      pivotId: PIVOT_ID,
    };
    const action = removeAppendBlock(blockInfo);
    const state = appendingReducer(appendingsState, action);
    const key = getAppendingKey(blockInfo);
    expect(get(state, [key, String(PIVOT_ID)])).toBeFalsy();
  });

  describe('submit append block', () => {
    let state;
    it('request', () => {
      const blockInfo = {
        bundleId: BUNDLE_ID,
        nodeId: NODE_ID,
        pivotId: PIVOT_ID,
      };
      const action = submitBlock.request(blockInfo);
      state = appendingReducer(appendingsState, action);
      const key = getAppendingKey(blockInfo);
      expect(get(state, [key, String(PIVOT_ID)]).submitting).toBe(true);
    });
    it('success', () => {
      const blockInfo = {
        bundleId: BUNDLE_ID,
        nodeId: NODE_ID,
        pivotId: PIVOT_ID,
      };
      const action = submitBlock.success(blockInfo);
      state = appendingReducer(state, action);
      const key = getAppendingKey(blockInfo);
      expect(get(state, [key, String(PIVOT_ID)])).toBeFalsy();
    });
  });

  describe('commit append block', () => {
    let state;
    it('request', () => {
      const blockInfo = {
        bundleId: BUNDLE_ID,
        nodeId: NODE_ID,
        pivotId: PIVOT_ID,
      };
      const action = commitBlock.request(blockInfo);
      state = appendingReducer(appendingsState, action);
      const key = getAppendingKey(blockInfo);
      expect(get(state, [key, String(PIVOT_ID)]).submitting).toBe(true);
    });
    it('success', () => {
      const blockInfo = {
        bundleId: BUNDLE_ID,
        nodeId: NODE_ID,
        pivotId: PIVOT_ID,
      };
      const action = commitBlock.success(blockInfo);
      state = appendingReducer(state, action);
      const key = getAppendingKey(blockInfo);
      expect(get(state, [key, String(PIVOT_ID)])).toBeFalsy();
    });
  });

  describe('commit tailing append block', () => {
    const blockInfo = {
      bundleId: BUNDLE_ID,
      nodeId: NODE_ID,
      pivotId: PIVOT_ID,
      isTailing: true,
    };
    const key = getAppendingKey(blockInfo);
    let state = {
      [key]: {},
    };
    state = update(state, {
      [key]: {
        [TAILING_PIVOT]: (block = {}) => ({
          ...block,
          editorState: createFromHTML('<p>demo</p>'),
        }),
      },
    });

    it('request', () => {
      const action = commitBlock.request(blockInfo);
      state = appendingReducer(state, action);
      expect(get(state, [key, TAILING_PIVOT]).submitting).toBe(true);
    });
    it('success', () => {
      const action = commitBlock.success(blockInfo);
      state = appendingReducer(state, action);
      expect(get(state, [key, TAILING_PIVOT]).submitting).toBeFalsy();
    });
  });

  describe('submit tailing append block', () => {
    const blockInfo = {
      bundleId: BUNDLE_ID,
      nodeId: NODE_ID,
      pivotId: PIVOT_ID,
      isTailing: true,
    };
    const key = getAppendingKey(blockInfo);
    let state = {
      [key]: {},
    };
    state = update(state, {
      [key]: {
        [TAILING_PIVOT]: (block = {}) => ({
          ...block,
          editorState: createFromHTML('<p>demo</p>'),
        }),
      },
    });
    it('request', () => {
      const action = submitBlock.request(blockInfo);
      state = appendingReducer(state, action);
      expect(get(state, [key, TAILING_PIVOT]).submitting).toBe(true);
    });
    it('success', () => {
      const action = submitBlock.success(blockInfo);
      state = appendingReducer(state, action);
      expect(get(state, [key, TAILING_PIVOT]).submitting).toBeFalsy();
    });
  });

  // TODO: handle tailing appending block
});
