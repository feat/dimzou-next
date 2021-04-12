import {
  initNodeEdit,
  changeTemplate,
  // changeEditPermission,
  createAppendBlock,
  removeAppendBlock,
  getBlockTranslation,
  commitRewording,
  removeBlock,
  patchNodeData,
} from '../actions';

import nodeReducer from '../reducers/node';

import { node as nodeData } from './demo-data';

const NODE_ID = 'NODE_ID';

describe('Dimzou Node', () => {
  let initialNodesState = nodeReducer(undefined, { type: 'DEMO' });

  describe('init Node Edit', () => {
    let state;
    it('fetch edit info', () => {
      const action = initNodeEdit.request({
        nodeId: NODE_ID,
      });
      state = nodeReducer(undefined, action);
      const nodeState = state[NODE_ID];
      expect(nodeState.isFetchingEditInfo).toBe(true);
    });
    it('fetch edit info failure', () => {
      const error = new Error('fetch edit info error');
      const action = initNodeEdit.failure({
        nodeId: NODE_ID,
        data: error,
      });
      const failureState = nodeReducer(state, action);
      const nodeState = failureState[NODE_ID];
      expect(nodeState.fetchError).toBe(error);
    });

    it('load edit info', () => {
      const action = initNodeEdit.success({
        nodeId: NODE_ID,
        basic: nodeData,
        title: 1,
        summary: 2,
        cover: 3,
        contentList: [5, 6, 7],
        blocks: {
          1: { id: 1 },
        },
      });
      state = nodeReducer(initialNodesState, action);
      initialNodesState = state;
      const nodeState = state[NODE_ID];
      expect(nodeState.isReady).toBe(true);
      expect(nodeState.basic).toBe(nodeData);
      expect(nodeState.title).toEqual(1);
      expect(nodeState.summary).toEqual(2);
      expect(nodeState.cover).toEqual(3);
      expect(nodeState.blocks).toEqual({
        1: { id: 1 },
      });
      expect(nodeState.contentList).toEqual([5, 6, 7]);
    });

    it('fetch edit info fulfill', () => {
      const action = initNodeEdit.fulfill({
        nodeId: NODE_ID,
      });
      const fulfillState = nodeReducer(state, action);
      const nodeState = fulfillState[NODE_ID];
      expect(nodeState.isFetchingEditInfo).toBe(false);
    });
  });

  describe('contentList', () => {
    it('init with node edit info', () => {
      // TODO
    });

    // commitBlock, submitBlock, submitMediaBlock, commitMediaBlock

    it('submitRewording.success', () => {});

    it('updateRewording.success', () => {});

    it('commmitRewording.success', () => {
      const state = {
        2: {
          contentList: [292588, 292589, 292590],
        },
      };
      const action = commitRewording.success({
        nodeId: 2,
        blockId: 292589,
        contentList: [292588, 292591, 292589, 292590],
      });
      const newState = nodeReducer(state, action);
      const nodeState = newState[2];
      expect(nodeState.contentList).toEqual([292588, 292591, 292589, 292590]);
    });

    // TODO: submitMediaRewording, updateMediaRewording, commitMediaRewording

    it('removeBlock.success', () => {
      const state = {
        2: {
          basic: {
            node_paragraphs_count: 3,
          },
          contentList: [292588, 292589, 292590],
        },
      };
      const action = removeBlock.success({
        nodeId: 2,
        contentList: [292588, 292589],
      });
      const newState = nodeReducer(state, action);
      const nodeState = newState[2];
      expect(nodeState.contentList).toEqual([292588, 292589]);
    });

    // TODO: removeRewording

    // TODO: electRewording
  });

  describe('title update', () => {
    it('commintRewording', () => {
      const state = {
        2: {
          title: null,
          blocks: {},
        },
      };
      const action = commitRewording.success({
        nodeId: 2,
        blockList: [4],
        structure: 'title',
        blocks: {
          4: {
            newState: true,
          },
        },
      });
      const newState = nodeReducer(state, action);
      const nodeState = newState[2];
      expect(nodeState.title).toEqual(4);
      expect(nodeState.blocks[4]).toEqual({ newState: true });
    });
  });

  describe('append content block', () => {
    let state;
    const pivotId = 1;
    it('create append block', () => {
      const action = createAppendBlock({
        nodeId: NODE_ID,
        pivotId,
        type: 'editor',
      });
      state = nodeReducer(initialNodesState, action);
      const nodeState = state[NODE_ID];
      expect(nodeState.appendings[pivotId]).toBeTruthy();
    });
    it('remove append block', () => {
      const action = removeAppendBlock({
        nodeId: NODE_ID,
        pivotId,
      });
      state = nodeReducer(initialNodesState, action);
      const nodeState = state[NODE_ID];
      // eslint-disable-next-line
      expect(nodeState.appendings.hasOwnProperty(pivotId)).toBeFalsy();
    });
  });

  describe('get block translation', () => {
    it('content success', () => {
      const blockId = 125010;
      const action = getBlockTranslation.success({
        nodeId: NODE_ID,
        structure: 'content',
        blockId,
        translation: 'TRANSLATION',
      });

      const state = nodeReducer(
        {
          [NODE_ID]: {
            blocks: {
              [blockId]: {},
            },
          },
        },
        action,
      );
      const nodeState = state[NODE_ID];
      const contentBlock = nodeState.blocks[blockId];
      expect(contentBlock.info).toBeTruthy();
      expect(contentBlock.info.translation).toEqual('TRANSLATION');
    });
  });

  describe('change template', () => {
    const initialState = {
      [NODE_ID]: {
        basic: {
          template: 'II',
        },
      },
    };
    it('change template trigger', () => {
      const action = changeTemplate({
        nodeId: NODE_ID,
        template: 'I',
      });
      const state = nodeReducer(initialNodesState, action);
      const bundleState = state[NODE_ID];
      expect(bundleState.cachedTemplate).toBe('I');
    });
    it('change template request', () => {
      const action = changeTemplate.request({ nodeId: NODE_ID });
      const state = nodeReducer(initialNodesState, action);
      const bundleState = state[NODE_ID];
      expect(bundleState.isChangingTemplate).toBe(true);
    });
    it('change template success', () => {
      const action = changeTemplate.success({
        nodeId: NODE_ID,
        data: { chapter_template: 'I' },
      });
      const state = nodeReducer(initialState, action);
      const bundleState = state[NODE_ID];
      expect(bundleState.basic.chapter_template).toBe('I');
      expect(bundleState.cachedTemplate).toBe(undefined);
    });
    it('change template failure', () => {
      const error = new Error('change template error');
      const action = changeTemplate.failure({
        nodeId: NODE_ID,
        data: error,
      });
      const state = nodeReducer(initialNodesState, action);
      const bundleState = state[NODE_ID];
      expect(bundleState.changeChapterError).toBe(error);
    });
    it('change template fulfill', () => {
      const action = changeTemplate.fulfill({
        nodeId: NODE_ID,
      });
      const state = nodeReducer(initialNodesState, action);
      const bundleState = state[NODE_ID];
      expect(bundleState.isChangingTemplate).toBe(false);
    });
  });

  describe('like rewording', () => {});

  describe('Patch node data', () => {
    const initState = {
      2: {
        blocks: { 1: { id: 1 } },
        contentList: [1, 2, 3],
      },
    };
    it('update blocks', () => {
      const action = patchNodeData({
        nodeId: 2,
        blocks: { 2: { id: 2 } },
      });
      const state = nodeReducer(initState, action);
      expect(state[2].blocks).toEqual({
        1: { id: 1 },
        2: { id: 2 },
      });
      expect(state[2].contentList).toEqual([1, 2, 3]);
    });
    it('update contentList', () => {
      const action = patchNodeData({
        nodeId: 2,
        contentList: [2, 4, 5],
      });
      const state = nodeReducer(initState, action);
      expect(state[2].contentList).toEqual([2, 4, 5]);
    });
    it('update rewording', () => {
      const action = patchNodeData({
        nodeId: 2,
        mutators: [
          {
            blocks: {
              2: (block) => ({
                ...block,
                update: true,
              }),
            },
          },
        ],
      });
      const state = nodeReducer(initState, action);
      expect(state[2].blocks[2].update).toEqual(true);
    });
  });
});
