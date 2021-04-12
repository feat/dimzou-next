import {
  initNodeEdit,
  submitRewording,
  commitRewording,
  electRewording,
  rejectRewording,
  commitMediaRewording,
  registerBlock,
  initBlockEdit,
  exitBlockEdit,
  getBlockTranslation,
  toggleBlockExpanded,
  updateBlockEditor,
  updateBlockState,
  loadBlockRange,
} from '../actions';

import blockReducer, {
  getBlockKey,
  // initialBlockState,
} from '../reducers/block';
import { createEmpty } from '../components/DimzouEditor';

import {
  NODE_TYPE_COVER,
  CONTENT_TYPE_TRANSLATE,
  NODE_STRUCTURE_CONTENT,
  NODE_STRUCTURE_TITLE,
  NODE_STRUCTURE_SUMMARY,
  NODE_STRUCTURE_COVER,
} from '../constants';

import { translationNode } from './demo-data';

const BLOCK_ID = 'BLOCK_ID';
const NODE_ID = 'NODE_ID';
const BUNDLE_ID = 'BUNDLE_ID';
const REWORDING_ID = 'REWORDING_ID';

describe('Dimzou Edit -- Block', () => {
  let blocksState;

  it('handle initNodeEdit.success, default', () => {
    const action = initNodeEdit.success({
      bundleId: BUNDLE_ID,
      nodeId: NODE_ID,
      basic: {
        id: NODE_ID,
        bundle_id: BUNDLE_ID,
      },
      title: 1,
      summary: 2,
      cover: 3,
      blocks: {
        1: { id: 1, type: NODE_STRUCTURE_TITLE },
        2: { id: 2, type: NODE_STRUCTURE_SUMMARY },
        3: { id: 3, type: NODE_STRUCTURE_COVER },
      },
    });
    const state = blockReducer(undefined, action);
    expect(state['title-1']).toBeTruthy();
    expect(state['summary-2']).toBeTruthy();
    expect(state['cover-3']).toBeTruthy();
  });

  it('handle initNodeEdit.success, empty cover node', () => {
    const action = initNodeEdit.success({
      bundleId: BUNDLE_ID,
      nodeId: NODE_ID,
      basic: {
        content_type: NODE_TYPE_COVER,
      },
      title: 1,
      summary: 2,
      blocks: {
        1: { id: 1, type: NODE_STRUCTURE_TITLE },
        2: { id: 2, type: NODE_STRUCTURE_SUMMARY },
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

  it('handle initNodeEdit.success, translation', () => {
    const action = initNodeEdit.success({
      bundleId: translationNode.bundle_id,
      nodeId: translationNode.node_id,
      contentType: CONTENT_TYPE_TRANSLATE,
      basic: translationNode,
      title: 2,
      summary: 3,
      cover: 1,
      blocks: {
        1: {
          type: NODE_STRUCTURE_COVER,
          id: 1,
          info: {
            origin:
              '/storage/dimzou_covers/B2ENI4b7eVtE42errGK6jIUhEiTjKYxhsRYcEouW.jpeg',
          },
          rewordings: [],
        },
        2: {
          id: 2,
          type: NODE_STRUCTURE_TITLE,
          info: {
            origin:
              '<h1><strong>通过了解其他人如何影响我们的旅程，让城市更适合步行</strong></h1>',
            translation:
              '<h1> <strong>Make the city more suitable for walking by understanding how others influence our journey</strong> </h1>',
          },
        },
        3: {
          id: 3,
          type: NODE_STRUCTURE_SUMMARY,
          info: {
            origin:
              '<p>虽然规划者和研究人员努力弄清楚什么使城市空间对行人有吸引力，但他们常常忽略了这样一个事实，即人们决定走路的地点和时间，不仅取决于环境的物理特性。事实上，这还受到他人的强烈影响。</p>',
            translation:
              '<p> While planners and researchers struggle to figure out what makes urban space attractive to pedestrians, they often overlook the fact that the place and time people decide to walk depends not only on the physical characteristics of the environment. In fact, this is also strongly influenced by others. </p>',
          },
        },
      },
    });
    const state = blockReducer(undefined, action);
    const titleBlockState = state['title-2'];
    expect(titleBlockState).toBeTruthy();
    expect(titleBlockState.isEditModeEnabled).toBe(true);
    expect(state['summary-3'].isEditModeEnabled).toBe(true);
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
    it('success', () => {
      // TODO: should reset edit state;
    });
    it('fulfill', () => {
      const payload = {
        blockId: BLOCK_ID,
        structure: 'content',
        rewordingId: REWORDING_ID,
        trigger: 'block',
      };
      const action = commitRewording.fulfill(payload);
      const state = blockReducer(blocksState, action);
      const blockKey = getBlockKey(payload);
      const blockState = state[blockKey];
      expect(blockState.submitting).toBe(false);
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

  describe('bulk init', () => {
    it('init content block for commitRewording.SUCCESS', () => {
      const payload = {
        structure: 'content',
        rewordingId: REWORDING_ID,
        blocks: {
          3: { id: 3, type: NODE_STRUCTURE_CONTENT },
          4: { id: 4, type: NODE_STRUCTURE_CONTENT },
        },
      };
      const action = commitRewording.success(payload);
      const newState = blockReducer({}, action);
      expect(newState['content-3']).toBeTruthy();
      expect(newState['content-4']).toBeTruthy();
    });
    it('init cover block for commitRewording.success', () => {
      const payload = {
        structure: 'cover',
        rewordingId: REWORDING_ID,
        blocks: {
          3: { id: 3, type: NODE_STRUCTURE_COVER },
        },
      };
      const action = commitRewording.success(payload);
      const newState = blockReducer({}, action);
      expect(newState['cover-3']).toBeTruthy();
    });
    it('loadBlockRange', () => {
      const payload = {
        structure: 'content',
        blocks: {
          3: { id: 3, type: NODE_STRUCTURE_CONTENT },
        },
      };
      const action = loadBlockRange(payload);
      const newState = blockReducer({}, action);
      expect(newState['content-3']).toBeTruthy();
    });
  });
});
