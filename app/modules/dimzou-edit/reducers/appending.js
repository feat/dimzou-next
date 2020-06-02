import { combineActions } from 'redux-actions';
import update from 'immutability-helper';
import { mapHandleActions } from '@/utils/reducerCreators';

import {
  submitBlock,
  commitBlock,
  submitMediaBlock,
  commitMediaBlock,
  loadNodeEditInfo,
  // appending
  createAppendBlock,
  updateAppendBlock,
  removeAppendBlock,
} from '../actions';

import { createEmpty, createEmptyWithFocus, createFromHTML, createFromHTMLWithFocus } from '../components/DimzouEditor';

import { TAILING_PIVOT } from '../constants';
// import { generateParaId } from '../utils/blocks';
import { getNodeCache, appendingBlockKey } from '../utils/cache';

export const getAppendingKey = ({ nodeId }) => nodeId;

const createTailingState = ({ bundleId, nodeId, shouldFocus }) => {
  const cache = getNodeCache(nodeId);
  let editorState;
  const blockCache = cache && cache.get(appendingBlockKey({
    nodeId,
    pivotId: TAILING_PIVOT,
  }));
  if (blockCache) {
    editorState = shouldFocus ? createFromHTMLWithFocus(blockCache) : createFromHTML(blockCache);
  } else {
    editorState = shouldFocus ? createEmptyWithFocus() : createEmpty();
  }
  
  return {
    type: 'editor',
    bundleId,
    nodeId,
    pivotId: TAILING_PIVOT,
    isTailing: true,
    editorState,
    editorInitialContent: blockCache ? null : editorState.getCurrentContent().getBlockMap(),
    editorMode: 'create',
  };
};

const reducer = mapHandleActions(
  {
    [loadNodeEditInfo]: (appendingState, action) => {
      const { payload } = action;
      return update(appendingState, {
        [TAILING_PIVOT]: {
          $set: createTailingState({
            bundleId: payload.bundleId,
            nodeId: payload.nodeId,
            shouldFocus: payload.data.content.length === 0,
          }),
        },
      });
    },
    [createAppendBlock]: (appendingState, action) => {
      const { payload } = action;
      return update(appendingState, {
        [payload.pivotId]: {
          $set: payload,
        },
      });
    },
    [updateAppendBlock]: (appendingState, action) => {
      const { payload } = action;
      return update(appendingState, {
        [payload.pivotId]: (blockState) => ({
          ...blockState,
          ...action.payload,
        }),
      });
    },
    [combineActions(
      removeAppendBlock.toString(),
      submitBlock.SUCCESS,
      commitBlock.SUCCESS,
      submitMediaBlock.SUCCESS,
      commitMediaBlock.SUCCESS,
    )]: (appendingState, action) => {
      const { payload } = action;

      if (payload.isTailing || payload.pivotId === TAILING_PIVOT) {
        return update(appendingState, {
          [TAILING_PIVOT]: (blockState) => {
            // reset block only if has text.
            if (
              blockState.editorState &&
              blockState.editorState.getCurrentContent().hasText()
            ) {
              return createTailingState({
                bundleId: payload.bundleId,
                nodeId: payload.nodeId,
              });
            }
            return blockState;
          },
        });
      }
      return update(appendingState, {
        [payload.pivotId]: { $set: undefined },
      });
    },
    [combineActions(
      submitMediaBlock.TRIGGER,
      commitMediaBlock.TRIGGER,
    )]: (appendingState, action) => {
      const { payload } = action;
      return update(appendingState, {
        [payload.pivotId]: (blockState) => {
          if (!blockState) {
            return blockState;
          }
          return ({
            ...blockState,
            requestError: null,
          })
        },
      })
    },
    [combineActions(
      submitMediaBlock.FAILURE,
      commitMediaBlock.FAILURE,
    )]: (appendingState, action) => {
      const { payload } = action;
      return update(appendingState, {
        [payload.pivotId]: (blockState) => ({
          ...blockState,
          requestError: payload.err,
        }),
      })
    },
    [combineActions(submitBlock.REQUEST, commitBlock.REQUEST)]: (
      appendingState,
      action,
    ) => {
      const { payload } = action;
      const blockKey = payload.isTailing
        ? TAILING_PIVOT
        : String(payload.pivotId);
      return update(appendingState, {
        [blockKey]: (blockState) => ({
          ...blockState,
          submitting: true,
        }),
      });
    },
    [combineActions(commitBlock.FULFILL, submitBlock.FULFILL)]: (
      appendingState,
      action,
    ) => {
      const { payload } = action;
      const blockKey = payload.isTailing
        ? TAILING_PIVOT
        : String(payload.pivotId);

      return update(appendingState, {
        [blockKey]: (blockState) => {
          if (!blockState) {
            return blockState;
          }
          return {
            ...blockState,
            submitting: false,
          };
        },
      });
    },
  },
  {},
  (action) => getAppendingKey(action.payload),
);

export default reducer;
