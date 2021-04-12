import { combineActions } from 'redux-actions';
import update from 'immutability-helper';
import { mapHandleActions } from '@/utils/reducerCreators';
import invariant from 'invariant';

import {
  // block
  registerBlock,
  initBlockEdit,
  exitBlockEdit,
  getBlockTranslation,
  toggleBlockExpanded,
  updateBlockEditor,
  updateBlockState,
  // node
  initNodeEdit,
  commitRewording,
  updateRewording,
  submitRewording,
  electRewording,
  rejectRewording,
  submitMediaRewording,
  commitMediaRewording,
  updateMediaRewording,
  removeBlock,
  loadBlockRange,
  commitBlock,
  submitBlock,
  commitMediaBlock,
  submitMediaBlock,
  patchNodeData,
} from '../actions';

import {
  BLOCK_KEY_SEPARATOR,
  BLOCK_EXPANDED_SECTION_VERSIONS,
  REWORDING_WIDGET_IMAGE,
  structureMap,
  // CONTENT_TYPE_TRANSLATE,
} from '../constants';
import { createFromRawData, createFromHTML } from '../components/DimzouEditor';
import { extractWidgetInfo } from '../utils/rewordings';
import { getNodeCache } from '../utils/cache';

export const initialBlockState = {
  expandedType: undefined, // 'versions' | 'comments',
  isEditModeEnabled: false,
  isEditModeForced: false,
  editorState: null,
  editorBaseId: undefined,
  editorMode: undefined, // 'create' | 'update'
  editorInitialContent: null,
  editorInitWithTranslation: false,
  isFetchingTranslation: false,
  updateRewording: false,
  isVersions: true,
};

// eslint-disable-next-line
function getInitialBlockState(block, structure, contentType) {
  // if (contentType === CONTENT_TYPE_TRANSLATE) {
  //   return initialBlockState;
  // }
  if (structure === 'cover') {
    return initialBlockState;
  }

  if (!block.rewordings || !block.rewordings.length) {
    const base = { ...initialBlockState };
    const hasTranslation = block.info && block.info.translation;
    let editorState;
    if (hasTranslation) {
      const widgetInfo = extractWidgetInfo({
        html_content: block.info.translation,
      });
      if (widgetInfo.type === REWORDING_WIDGET_IMAGE) {
        // have nothing to do
      } else {
        editorState = createFromHTML(block.info.translation);
        base.editorInitWithTranslation = true;
      }
    } else {
      editorState =
        structure === 'title'
          ? createFromRawData({
              blocks: [{ type: 'header-one', text: '' }],
              entityMap: {},
            })
          : createFromRawData({
              blocks: [{ type: 'unstyled', text: '' }],
              entityMap: {},
            });
    }
    if (editorState) {
      base.editorState = editorState;
      base.editorBaseId = undefined;
      base.editorMode = 'create';
      base.editorInitialContent = editorState.getCurrentContent().getBlockMap();
      base.isEditModeEnabled = true;
      base.isEditModeForced = true;
    }
    return base;
  }
  return initialBlockState;
}

export const getBlockKey = ({ structure, blockId }) => {
  invariant(structure, '`structure` is required to init blocks');
  return `${structure}${BLOCK_KEY_SEPARATOR}${blockId}`;
};

const initWithNodeInit = (state, action) => {
  let newState = { ...state };
  const {
    payload: { basic, title, cover, summary, blocks, contentType },
  } = action;
  if (title) {
    const blockKey = getBlockKey({
      structure: 'title',
      blockId: title,
    });
    if (!newState[blockKey]) {
      newState[blockKey] = {
        ...getInitialBlockState(blocks[title], 'title', contentType),
        structure: 'title',
        bundleId: basic.bundle_id,
        nodeId: basic.id,
        blockId: title,
        expandedType: BLOCK_EXPANDED_SECTION_VERSIONS,
      };
    }
  }
  if (summary) {
    const blockKey = getBlockKey({
      structure: 'summary',
      blockId: summary,
    });
    if (!newState[blockKey]) {
      newState[blockKey] = {
        ...getInitialBlockState(blocks[summary], 'summary', contentType),
        structure: 'summary',
        bundleId: basic.bundle_id,
        nodeId: basic.id,
        blockId: summary,
        expandedType: BLOCK_EXPANDED_SECTION_VERSIONS,
      };
    }
  }
  if (cover) {
    const blockKey = getBlockKey({
      structure: 'cover',
      blockId: cover,
    });
    if (!newState[blockKey]) {
      newState[blockKey] = {
        ...initialBlockState,
        structure: 'cover',
        bundleId: basic.bundle_id,
        nodeId: basic.id,
        blockId: cover,
      };
    }
  } else if (!newState[`node-cover-${basic.id}`]) {
    newState[`cover-node:${basic.id}`] = {
      ...initialBlockState,
      structure: 'cover',
      bundleId: basic.bundle_id,
      nodeId: basic.id,
      blockId: cover,
    };
  }
  // initialize with cache
  const cache = getNodeCache(action.payload.nodeId);
  if (cache) {
    Object.keys(newState).forEach((key) => {
      // if has cache, init block edit with cache;
      const blockCache = cache.get(`block-${key}`);
      if (blockCache) {
        const { html, ...payload } = blockCache;
        payload.editorState = createFromHTML(html);
        newState = baseBlockReducer(newState, initBlockEdit(payload));
      }
    });
  }
  return newState;
};

const initWithChunk = (state, action) => {
  const { nodeId, bundleId, blocks } = action.payload;
  // patchNodeData 可能没有 blocks 数据
  if (!blocks) {
    return state;
  }
  const newState = { ...state };
  Object.values(blocks).forEach((block) => {
    const structure = structureMap[block.type];
    const blockKey = getBlockKey({
      structure,
      blockId: block.id,
    });
    if (!newState[blockKey]) {
      newState[blockKey] = {
        ...getInitialBlockState(block, structure),
        structure,
        bundleId,
        nodeId,
        blockId: block.id,
        // only accepted block has expanded.
        expandedType:
          // index === 0 && // all block should be expanded
          block.rewordings && block.rewordings.some((item) => item.is_selected)
            ? BLOCK_EXPANDED_SECTION_VERSIONS
            : undefined,
      };
    }
  });
  return newState;
};

const toggleBlockReducer = (state, action) => {
  const { payload } = action;
  const blockKey = getBlockKey(payload);
  const { expandedType } = payload;
  return update(state, {
    [blockKey]: (blockState) => ({
      ...blockState,
      expandedType:
        blockState.expandedType === expandedType ? undefined : expandedType,
      isVersions: expandedType === BLOCK_EXPANDED_SECTION_VERSIONS,
    }),
  });
  // if (payload.structure !== 'content') {
  //   return update(state, {
  //     [blockKey]: (blockState) => ({
  //       ...blockState,
  //       expandedType:
  //       blockState.expandedType === expandedType ? undefined : expandedType,
  //     }),
  //   });
  // }
  // const mapped = {};
  // Object.entries(state).forEach(([key, blockState]) => {
  //   let nextState;
  //   if (key !== blockKey && blockState.expandedType) {
  //     nextState =  { ...blockState, expandedType: undefined };
  //   } else if (key !== blockKey) {
  //     nextState = blockState;
  //   } else {
  //     nextState = {
  //       ...blockState,
  //       expandedType:
  //         blockState.expandedType === expandedType ? undefined : expandedType,
  //     }
  //   }
  //   mapped[key] = nextState;
  // })

  // return mapped;
};

const baseBlockReducer = mapHandleActions(
  {
    [registerBlock]: (blockState, action) => {
      const { payload } = action;

      if (blockState !== initialBlockState) {
        return blockState;
      }
      const nextState = { ...blockState, ...payload };
      if (payload.structure === 'content') {
        nextState.expandedType = BLOCK_EXPANDED_SECTION_VERSIONS;
      }
      if (payload.editorState) {
        nextState.editorState = payload.editorState;
        nextState.editorMode = payload.editorMode;
        nextState.editorInitialContent = payload.editorState
          .getCurrentContent()
          .getBlockMap();
        nextState.isEditModeEnabled = true;
      }

      return nextState;
    },
    [initBlockEdit]: (blockState, action) => {
      const { payload } = action;
      if (payload.structure === 'cover') {
        return {
          ...blockState,
          isEditModeEnabled: true,
          box: payload.box,
          sourceImage: payload.sourceImage,
          file: payload.file,
          activeRewording: payload.activeRewording,
          updateRewording: payload.updateRewording,
          cropperBaseId: payload.basedOn,
        };
      }
      return {
        ...blockState,
        isEditModeEnabled: true,
        editorState: payload.editorState,
        editorMode: payload.editorMode,
        editorBaseId: payload.basedOn,
        updateBaseHTML: payload.updateBaseHTML,
        rewordBaseHTML: payload.rewordBaseHTML,
        editorInitWithTranslation: payload.editorInitWithTranslation,
        updateRewording: payload.updateRewording,
      };
    },
    [exitBlockEdit]: (blockState, action) => {
      const { payload } = action;

      if (payload.structure === 'cover') {
        return {
          ...blockState,
          isEditModeEnabled: false,
          box: null,
          sourceImage: null,
          file: null,
          activeRewording: undefined,
        };
      }
      return {
        ...blockState,
        isEditModeEnabled: false,
        editorState: null,
        editorMode: undefined,
        editorInitialContent: null,
        editorInitWithTranslation: false,
        editorBaseId: undefined,
        updateBaseHTML: undefined,
        rewordBaseHTML: undefined,
        updateRewording: false,
      };
    },
    [updateBlockEditor]: (blockState, action) => {
      const { payload } = action;
      return {
        ...blockState,
        editorState: payload.editorState,
      };
    },
    [updateBlockState]: (blockState, action) => {
      const { payload } = action;
      return {
        ...blockState,
        ...payload,
      };
    },
    [getBlockTranslation.REQUEST]: (blockState) => ({
      ...blockState,
      isFetchingTranslation: true,
    }),
    [getBlockTranslation.FULFILL]: (blockState) => ({
      ...blockState,
      isFetchingTranslation: false,
    }),
    [combineActions(
      commitRewording.REQUEST,
      submitRewording.REQUEST,
      updateRewording.REQUEST,
      removeBlock.REQUEST,
    )]: (blockState, action) => {
      const {
        payload: { trigger },
      } = action;
      if (trigger !== 'block') {
        return blockState;
      }
      return {
        ...blockState,
        submitting: true,
      };
    },
    [combineActions(
      commitRewording.SUCCESS,
      submitRewording.SUCCESS,
      updateRewording.SUCCESS,
      removeBlock.SUCCESS,
    )]: (blockState, action) => {
      const {
        payload: { trigger },
      } = action;
      if (trigger !== 'block') {
        return blockState;
      }
      return {
        ...blockState,
        isEditModeEnabled: false,
        editorState: null,
        editorMode: undefined,
        editorInitialContent: null,
        editorInitWithTranslation: false,
        editorBaseId: undefined,
        updateBaseHTML: undefined,
        rewordBaseHTML: undefined,
        updateRewording: false,
        isEditModeForced: false,
      };
    },
    [combineActions(
      commitRewording.FULFILL,
      submitRewording.FULFILL,
      updateRewording.FULFILL,
      removeBlock.FULFILL,
    )]: (blockState, action) => {
      const {
        payload: { trigger },
      } = action;
      if (trigger !== 'block') {
        return blockState;
      }
      return {
        ...blockState,
        submitting: false,
      };
    },
    [combineActions(electRewording.REQUEST, rejectRewording.REQUEST)]: (
      blockState,
    ) => ({
      ...blockState,
      electingRewording: true,
    }),
    [combineActions(electRewording.FULFILL, rejectRewording.FULFILL)]: (
      blockState,
    ) => ({
      ...blockState,
      electingRewording: false,
    }),
    [combineActions(
      submitMediaRewording,
      commitMediaRewording,
      updateMediaRewording,
    )]: (blockState, action) => {
      const { payload } = action;
      if (payload.trigger !== 'origin' && payload.trigger !== 'block') {
        return blockState;
      }
      if (payload.trigger === 'block') {
        return {
          ...blockState,
          isSubmittingFile: true,
          fileSubmitting: payload.file,
        };
      }
      if (payload.trigger === 'origin') {
        return {
          ...blockState,
          isSubmittingFileFromOrigin: true,
          fileSubmitting: payload.file,
        };
      }
      return blockState;
    },
    [combineActions(
      submitMediaRewording.SUCCESS,
      commitMediaRewording.SUCCESS,
      updateMediaRewording.SUCCESS,
    )]: (blockState, action) => {
      const { payload } = action;
      if (payload.trigger !== 'origin' && payload.trigger !== 'block') {
        return blockState;
      }
      return {
        ...blockState,
        fileSubmitting: null,
      };
    },
    [combineActions(
      submitMediaRewording.FULFILL,
      commitMediaRewording.FULFILL,
      updateMediaRewording.FULFILL,
    )]: (blockState, action) => {
      const { payload } = action;
      if (payload.trigger !== 'origin' && payload.trigger !== 'block') {
        return blockState;
      }
      if (payload.trigger === 'block') {
        return {
          ...blockState,
          isSubmittingFile: false,
        };
      }
      if (payload.trigger === 'origin') {
        return {
          ...blockState,
          isSubmittingFileFromOrigin: false,
        };
      }
      return blockState;
    },
  },
  initialBlockState,
  (action) => getBlockKey(action.payload),
);

const blockReducer = (state = {}, action) => {
  if (action.type === initNodeEdit.SUCCESS) {
    return initWithNodeInit(state, action);
  }
  if (
    action.type === loadBlockRange.toString() ||
    action.type === patchNodeData.toString() ||
    action.type === commitBlock.SUCCESS ||
    action.type === submitBlock.SUCCESS ||
    action.type === commitMediaBlock.SUCCESS ||
    action.type === submitMediaBlock.SUCCESS ||
    action.type === commitRewording.SUCCESS
  ) {
    const blockInitialized = initWithChunk(state, action);
    return baseBlockReducer(blockInitialized, action);
  }

  if (action.type === toggleBlockExpanded.toString()) {
    return toggleBlockReducer(state, action);
  }
  return baseBlockReducer(state, action);
};

export default blockReducer;
