import { combineActions } from 'redux-actions';
import { mapHandleActions } from '@/utils/reducerCreators';

import {
  // data related ui
  removeRewording,
  submitRewording,
  updateRewording,
  commitRewording,
  submitMediaRewording,
  commitMediaRewording,
  updateMediaRewording,
  // ui
  openCommentPanel,
  closeCommentPanel,
  initRewordingEdit,
  exitRewordingEdit,
  updateRewordingEditor,
  loadNodeEditInfo,
} from '../actions';
import { createFromHTML } from '../components/DimzouEditor';
import { getNodeCache } from '../utils/cache';

export const initialRewordingState = {
  isEditModeEnabled: false,
  isCommentPanelOpened: false,
  editorState: null,
  editorInitialContent: undefined,
};

const baseRewordingReducer = mapHandleActions(
  {
    [openCommentPanel]: (rewordingState) => ({
      ...rewordingState,
      isCommentPanelOpened: true,
    }),
    [closeCommentPanel]: (rewordingState) => ({
      ...rewordingState,
      isCommentPanelOpened: false,
    }),
    [initRewordingEdit]: (rewordingState, action) => {
      const { payload } = action;
      return {
        ...rewordingState,
        ...payload,
        isEditModeEnabled: true,
      };
    },
    [updateRewordingEditor]: (rewordingState, action) => {
      const {
        payload: { editorState },
      } = action;
      return {
        ...rewordingState,
        editorState,
      };
    },
    [exitRewordingEdit]: (rewordingState) => ({
      ...rewordingState,
      isEditModeEnabled: false,
      editorInitialContent: undefined,
      editorState: null,
    }),
    [combineActions(
      removeRewording.REQUEST,
      submitRewording.REQUEST,
      updateRewording.REQUEST,
      commitRewording.REQUEST,
    )]: (rewordingState, action) => {
      const {
        payload: { trigger },
      } = action;
      if (trigger === 'rewording') {
        return {
          ...rewordingState,
          submitting: true,
        };
      }
      return rewordingState;
    },
    [combineActions(
      removeRewording.SUCCESS,
      submitRewording.SUCCESS,
      updateRewording.SUCCESS,
      commitRewording.SUCCESS,
    )]: (rewordingState, action) => {
      const {
        payload: { trigger },
      } = action;
      if (trigger === 'rewording') {
        return {
          ...rewordingState,
          editorState: null,
          editorInitialContent: undefined,
          isEditModeEnabled: false,
        };
      }
      return rewordingState;
    },
    [combineActions(
      removeRewording.FULFILL,
      submitRewording.FULFILL,
      updateRewording.FULFILL,
      commitRewording.FULFILL,
    )]: (rewordingState, action) => {
      const {
        payload: { trigger },
      } = action;
      if (trigger === 'rewording') {
        return {
          ...rewordingState,
          submitting: false,
        };
      }
      return rewordingState;
    },
    [combineActions(
      submitMediaRewording.TRIGGER,
      updateMediaRewording.TRIGGER,
      commitMediaRewording.TRIGGER,
    )]: (rewordingState, action) => {
      const {
        payload: { trigger, file },
      } = action;
      if (trigger === 'rewording') {
        return {
          ...rewordingState,
          isSubmittingFile: true,
          fileSubmitting: file,
        };
      }
      return rewordingState;
    },
    [combineActions(
      submitMediaRewording.SUCCESS,
      updateMediaRewording.SUCCESS,
      commitMediaRewording.SUCCESS,
    )]: (rewordingState, action) => {
      const {
        payload: { trigger },
      } = action;
      if (trigger === 'rewording') {
        return {
          ...rewordingState,
          fileSubmitting: null,
        };
      }
      return rewordingState;
    },
    [combineActions(
      submitMediaRewording.FULFILL,
      updateMediaRewording.FULFILL,
      commitMediaRewording.FULFILL,
    )]: (rewordingState, action) => {
      const {
        payload: { trigger },
      } = action;
      if (trigger === 'rewording') {
        return {
          ...rewordingState,
          isSubmittingFile: false,
        };
      }
      return rewordingState;
    },
  },
  initialRewordingState,
  (action) => action.payload.rewordingId,
);

function initializeWithCache(state, action) {
  const cache = getNodeCache(action.payload.nodeId);
  if (!cache) {
    return state;
  }
  let newState = state;
  const rewordings = Object.entries(cache.all()).filter(([key]) => /^rewording-/.test(key));
  rewordings.forEach((data) => {
    if (typeof data[1] !== 'object' && !data.html) {
      return;
    }
    const { html, ...payload } = data[1];
    payload.editorState = createFromHTML(html);
    newState = baseRewordingReducer(newState, initRewordingEdit(payload));
  })
  return newState;
}

function rewordingReducer(state = {}, action) {
  if (action.type === loadNodeEditInfo.toString()) {
    return initializeWithCache(state, action);
  }
  return baseRewordingReducer(state, action);
}

export default rewordingReducer;
