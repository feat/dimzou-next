import {
  fetchNodeEditInfo,
  loadNodeEditInfo,
  // patchContent,
  changeTemplate,
  // changeEditPermission,
  createAppendBlock,
  removeAppendBlock,
  getBlockTranslation,
} from '../actions';

import nodeReducer from '../reducers/node';

import { node as nodeData } from './demo-data';

const NODE_ID = 'NODE_ID';

describe('Dimzou Node', () => {
  let initialNodesState = nodeReducer(undefined, { type: 'DEMO' });

  describe('initialize', () => {
    let state;
    it('fetch edit info', () => {
      const action = fetchNodeEditInfo.request({
        nodeId: NODE_ID,
      });
      state = nodeReducer(undefined, action);
      const nodeState = state[NODE_ID];
      expect(nodeState.isFetchingEditInfo).toBe(true);
    });
    it('fetch edit info failure', () => {
      const error = new Error('fetch edit info error');
      const action = fetchNodeEditInfo.failure({
        nodeId: NODE_ID,
        data: error,
      });
      state = nodeReducer(state, action);
      const nodeState = state[NODE_ID];

      expect(nodeState.fetchError).toBe(error);
    });
    it('fetch edit info fulfill', () => {
      const action = fetchNodeEditInfo.fulfill({
        nodeId: NODE_ID,
      });
      state = nodeReducer(state, action);
      const nodeState = state[NODE_ID];
      expect(nodeState.isFetchingEditInfo).toBe(false);
    });
    it('load edit info', () => {
      const action = loadNodeEditInfo({
        nodeId: NODE_ID,
        data: nodeData,
      });
      state = nodeReducer(initialNodesState, action);
      initialNodesState = state;
      const nodeState = state[NODE_ID];
      expect(nodeState.isReady).toBe(true);
      expect(nodeState.data).toBe(nodeData);
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

  // describe('update data', () => {
  //   it('handle patch content', () => {
  //     const data = { id: 1 };
  //     const action = patchContent({ nodeId: NODE_ID, data });
  //     const state = nodeReducer(initialNodesState, action);
  //     const nodeState = state[NODE_ID];
  //     expect(nodeState.data).toEqual(data);
  //   });
  // });

  describe('get block translation', () => {
    it('content success', () => {
      const blockId = 125010;
      const action = getBlockTranslation.success({
        nodeId: NODE_ID,
        structure: 'content',
        blockId,
        translation: 'TRANSLATION',
      });

      const state = nodeReducer(initialNodesState, action);
      const nodeState = state[NODE_ID];
      const contentBlock = nodeState.data.content.find(
        (item) => item.id === blockId,
      );
      expect(contentBlock.info).toBeTruthy();
      expect(contentBlock.info.translation).toEqual('TRANSLATION');
    });
  });

  describe('change template', () => {
    const initialState = {
      [NODE_ID]: {
        data: {
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
      expect(bundleState.data.chapter_template).toBe('I');
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
});
