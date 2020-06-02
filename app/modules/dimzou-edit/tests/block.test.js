import {
  loadNodeEditInfo,
  submitRewording,
  commitRewording,
  electRewording,
  rejectRewording,
  electBlock,
  rejectBlock,
  commitMediaRewording,

  registerBlock,
  initBlockEdit,
  exitBlockEdit,
  getBlockTranslation,
  toggleBlockExpanded,
  updateBlockEditor,
  updateBlockState,
} from '../actions';

import blockReducer, {
  getBlockKey,
  // initialBlockState,
} from '../reducers/block';
import { createEmpty } from '../components/DimzouEditor';

import { NODE_TYPE_COVER, CONTENT_TYPE_TRANSLATE } from '../constants';

import { translationNode } from './demo-data';

const BLOCK_ID = 'BLOCK_ID';
const NODE_ID = 'NODE_ID';
const BUNDLE_ID = 'BUNDLE_ID';
const REWORDING_ID = 'REWORDING_ID';

describe('Dimzou Edit -- Block', () => {
  let blocksState;

  it('handle loadNodeEditInfo, first block has not selected rewording', () => {
    const action = loadNodeEditInfo({
      bundleId: BUNDLE_ID,
      nodeId: NODE_ID,
      data: {
        title: { id: 1 },
        summary: { id: 2 },
        cover: { id: 3 },
        content: [{ id: 4, rewordings: [] }, { id: 5 }],
      },
    });
    const state = blockReducer(undefined, action);
    expect(state['title-1']).toBeTruthy();
    expect(state['summary-2']).toBeTruthy();
    expect(state['cover-3']).toBeTruthy();
    expect(state['content-4']).toBeTruthy();
    // expect(state['content-4'].expandedType).toEqual(undefined);
    expect(state['content-5']).toBeTruthy();
  });

  it('handle loadNodeEditInfo, empty cover node', () => {
    const action = loadNodeEditInfo({
      bundleId: BUNDLE_ID,
      nodeId: NODE_ID,
      data: {
        content_type: NODE_TYPE_COVER,
        title: { id: 1 },
        summary: { id: 2 },
      },
    });
    const state = blockReducer(undefined, action);
    const titleBlockState = state['title-1'];
    expect(titleBlockState).toBeTruthy();
    expect(titleBlockState.isEditModeEnabled).toBe(true);
    expect(titleBlockState.isEditModeForced).toBe(true);
    expect(titleBlockState.editorMode).toBe('create');
    expect(titleBlockState.editorState).toBeTruthy();
  });

  it('handle loadNodeEditInfo, translation', () => {
    const action = loadNodeEditInfo({
      bundleId: translationNode.bundle_id,
      nodeId: translationNode.node_id,
      contentType: CONTENT_TYPE_TRANSLATE,
      data: translationNode,
    });
    const state = blockReducer(undefined, action);
    const titleBlockState = state['title-2'];
    expect(titleBlockState).toBeTruthy();
    expect(titleBlockState.isEditModeEnabled).toBe(true);
    expect(state['summary-3'].isEditModeEnabled).toBe(true);
    expect(state['content-4'].isEditModeEnabled).toBe(true);
  });

  it('register block', () => {
    const payload = {
      blockId: BLOCK_ID,
      nodeId: NODE_ID,
      bundleId: BUNDLE_ID,
      structure: 'content',
    };
    const action = registerBlock(payload);
    const state = blockReducer(undefined, action);
    blocksState = state;
    const blockKey = getBlockKey(payload);
    const blockState = state[blockKey];
    expect(blockState.structure).toEqual('content');
    expect(blockState.blockId).toEqual(BLOCK_ID);
    expect(blockState.nodeId).toEqual(NODE_ID);
    expect(blockState.bundleId).toEqual(BUNDLE_ID);
  });

  describe('block edit', () => {
    it('init block edit', () => {
      const editorState = createEmpty();
      const payload = {
        blockId: BLOCK_ID,
        nodeId: NODE_ID,
        bundleId: BUNDLE_ID,
        structure: 'content',
        editorState,
      };
      const action = initBlockEdit(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      expect(state[blockKey].isEditModeEnabled).toBe(true);
    });

    it('update block editor', () => {
      const editorState = createEmpty();
      const payload = {
        blockId: BLOCK_ID,
        nodeId: NODE_ID,
        bundleId: BUNDLE_ID,
        structure: 'content',
        editorState,
      };
      const action = updateBlockEditor(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      expect(state[blockKey].editorState).toEqual(editorState);
    });

    it('update block state', () => {
      const payload = {
        blockId: BLOCK_ID,
        nodeId: NODE_ID,
        bundleId: BUNDLE_ID,
        structure: 'content',
        customKey: 'demo',
      };
      const action = updateBlockState(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      expect(state[blockKey].customKey).toEqual('demo');
    });

    it('exit block edit', () => {
      const payload = {
        blockId: BLOCK_ID,
        nodeId: NODE_ID,
        bundleId: BUNDLE_ID,
        structure: 'content',
      };
      const action = exitBlockEdit(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      expect(state[blockKey].isEditModeEnabled).toBe(false);
    });
  });

  describe('block edit with translation', () => {
    let state;
    it('init block edit', () => {
      const editorState = createEmpty();
      const payload = {
        blockId: BLOCK_ID,
        nodeId: NODE_ID,
        bundleId: BUNDLE_ID,
        structure: 'content',
        editorState,
        editorMode: 'create',
        editorInitWithTranslation: true,
      };
      const action = initBlockEdit(payload);
      state = blockReducer(state, action);
      const blockKey = getBlockKey(payload);
      expect(state[blockKey].isEditModeEnabled).toBe(true);
      expect(state[blockKey].editorInitWithTranslation).toBe(true);
    });

    it('exit block edit', () => {
      const payload = {
        blockId: BLOCK_ID,
        nodeId: NODE_ID,
        bundleId: BUNDLE_ID,
        structure: 'content',
      };
      const action = exitBlockEdit(payload);
      state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      expect(state[blockKey].isEditModeEnabled).toBe(false);
      expect(state[blockKey].editorInitWithTranslation).toBe(false);
    });
  });

  it('toggle expanded', () => {
    const payload = {
      blockId: BLOCK_ID,
      nodeId: NODE_ID,
      bundleId: BUNDLE_ID,
      structure: 'content',
      expandedType: 'comment',
    };
    const action = toggleBlockExpanded(payload);
    const state = blockReducer(blocksState, action);
    const blockKey = getBlockKey(payload);
    expect(state[blockKey].expandedType).toEqual('comment');
  });

  describe('submit rewording', () => {
    it('request', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'block',
      };
      const action = submitRewording.request(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.submitting).toBe(true);
    });
  });

  describe('commit rewording', () => {
    it('request', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'block',
      };
      const action = commitRewording.request(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.submitting).toBe(true);
    });
  });

  describe('elect block', () => {
    it('request', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'block',
      };
      const action = electBlock.request(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.electingRewording).toBe(true);
    });
    it('fulfill', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'block',
      };
      const action = electBlock.fulfill(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.electingRewording).toBe(false);
    });
  });

  describe('reject block', () => {
    it('request', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'block',
      };
      const action = rejectBlock.request(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.electingRewording).toBe(true);
    });
    it('fulfill', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'block',
      };
      const action = rejectBlock.fulfill(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.electingRewording).toBe(false);
    });
  });

  describe('elect rewording', () => {
    it('request', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'block',
      };
      const action = electRewording.request(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.electingRewording).toBe(true);
    });
    it('fulfill', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'block',
      };
      const action = electRewording.fulfill(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.electingRewording).toBe(false);
    });
  });

  describe('reject rewording', () => {
    it('request', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'block',
      };
      const action = rejectRewording.request(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.electingRewording).toBe(true);
    });
  });

  describe('get block translation', () => {
    it('request', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'block',
      };
      const action = getBlockTranslation.request(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.isFetchingTranslation).toBe(true);
    });
    it('fulfill', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'block',
      };
      const action = getBlockTranslation.fulfill(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.isFetchingTranslation).toBe(false);
    });
  });

  describe('commit media rewording', () => {
    let state;
    it('trigger', () => {
      const file = {};
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'block',
        file,
      };
      const action = commitMediaRewording(payload);
      state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.isSubmittingFile).toBe(true);
      expect(blockState.fileSubmitting).toBe(file);
    });

    it('success', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'block',
      };
      const action = commitMediaRewording.success(payload);
      state = blockReducer(state, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.fileSubmitting).toBe(null);
    });

    it('success', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'block',
      };
      const action = commitMediaRewording.fulfill(payload);
      state = blockReducer(state, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.isSubmittingFile).toBe(false);
    });
  });

  describe('commit media rewording, origin', () => {
    let state;
    it('trigger', () => {
      const file = {};
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'origin',
        file,
      };
      const action = commitMediaRewording(payload);
      state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.isSubmittingFileFromOrigin).toBe(true);
      expect(blockState.fileSubmitting).toBe(file);
    });

    it('success', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'origin',
      };
      const action = commitMediaRewording.success(payload);
      state = blockReducer(state, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.fileSubmitting).toBe(null);
    });

    it('fulfill', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'origin',
      };
      const action = commitMediaRewording.fulfill(payload);
      state = blockReducer(state, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.isSubmittingFileFromOrigin).toBe(false);
    });
  });
});
