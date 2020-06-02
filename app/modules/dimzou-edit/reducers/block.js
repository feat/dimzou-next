import { combineActions } from 'redux-actions';
import update from 'immutability-helper';
import { mapHandleActions } from '@/utils/reducerCreators';

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
  loadNodeEditInfo,
  commitRewording,
  updateRewording,
  submitRewording,
  electRewording,
  rejectRewording,
  electBlock,
  rejectBlock,
  submitMediaRewording,
  commitMediaRewording,
  updateMediaRewording,
  patchContent,
  removeBlock,
} from '../actions';

import {
  BLOCK_KEY_SEPARATOR,
  BLOCK_EXPANDED_SECTION_VERSIONS,
  REWORDING_WIDGET_IMAGE,
  // CONTENT_TYPE_TRANSLATE,
} from '../constants';
import { createFromRawData, createFromHTML } from '../components/DimzouEditor';
import { extractWidgetInfo } from '../utils/rewordings';

export const initialBlockState = {
  expandedType: undefined,
  isEditModeEnabled: false,
  isEditModeForced: false,
  editorState: null,
  editorBaseId: undefined,
  editorMode: undefined,
  editorInitialContent: null,
  editorInitWithTranslation: false,
  isFetchingTranslation: false,
  updateRewording: false,
  editType: undefined, // ???
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

export const getBlockKey = ({ structure, blockId }) =>
  `${structure}${BLOCK_KEY_SEPARATOR}${blockId}`;

const initBlockWithNodeInfo = (state, action) => {
  const newState = { ...state };
  const {
    payload: { data, contentType },
  } = action;
  if (data.title) {
    const blockKey = getBlockKey({ structure: 'title', blockId: data.title.id });
    if (!newState[blockKey]) {
      newState[blockKey] = {
        ...getInitialBlockState(data.title, 'title', contentType),
        structure: 'title',
        bundleId: data.bundle_id,
        nodeId: data.id,
        blockId: data.title.id,
        expandedType: BLOCK_EXPANDED_SECTION_VERSIONS,
      };
    }
  }
  if (data.summary) {
    const blockKey = getBlockKey({ structure: 'summary', blockId: data.summary.id });
    if (!newState[blockKey]) {
      newState[
        blockKey
      ] = {
        ...getInitialBlockState(data.summary, 'summary', contentType),
        structure: 'summary',
        bundleId: data.bundle_id,
        nodeId: data.id,
        blockId: data.summary.id,
        expandedType: BLOCK_EXPANDED_SECTION_VERSIONS,
      };
    }
  }
  if (data.cover) {
    const blockKey = getBlockKey({ structure: 'cover', blockId: data.cover.id });
    if (!newState[blockKey]) {
      newState[blockKey] = {
        ...initialBlockState,
        structure: 'cover',
        bundleId: data.bundle_id,
        nodeId: data.id,
        blockId: data.cover.id,
      };
    }
  }
  if (data.content) {
    data.content.forEach((block) => {
      const blockKey = getBlockKey({ structure: 'content', blockId: block.id });
      if (!newState[blockKey]) {
        newState[blockKey] = {
          ...getInitialBlockState(block, 'content', contentType),
          structure: 'content',
          bundleId: data.bundle_id,
          nodeId: data.id,
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
  }
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
        nextState.editType = payload.editType;
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
    [combineActions(
      electRewording.REQUEST,
      rejectRewording.REQUEST,
      electBlock.REQUEST,
      rejectBlock.REQUEST,
    )]: (blockState) => ({
      ...blockState,
      electingRewording: true,
    }),
    [combineActions(
      electRewording.FULFILL,
      rejectRewording.FULFILL,
      electBlock.FULFILL,
      rejectBlock.FULFILL,
    )]: (blockState) => ({
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
  if (
    action.type === loadNodeEditInfo.toString() ||
    action.type === patchContent.toString()
  ) {
    return initBlockWithNodeInfo(state, action);
  }
  if (action.type === toggleBlockExpanded.toString()) {
    return toggleBlockReducer(state, action);
  }
  return baseBlockReducer(state, action);
};

export default blockReducer;
