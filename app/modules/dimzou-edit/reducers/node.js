import { combineActions } from 'redux-actions';
import update from 'immutability-helper';
import { mapHandleActions } from '@/utils/reducerCreators';
import invariant from 'invariant';

import {
  updateNodeSort,
  resetBundle,
  loadBlockRange,
  commitBlock,
  submitBlock,
  submitMediaBlock,
  commitMediaBlock,
  // updateBlockSort,
  patchCollaborators,
  fetchCollaborators,
  changeEditPermission,
  changeTemplate,
  // invitation
  createInvitation,
  // appending
  createAppendBlock,
  removeAppendBlock,
  updateAppendBlock,
  // like
  likeRewording,
  unlikeRewording,
  // block
  getBlockTranslation,
  initBlockEdit,
  updateBlockEditor,
  removeBlock,
  // comment
  createRewordingComment,
  markRewordShared,
  // rewording
  initRewordingEdit,
  updateRewordingEditor,
  separateNode,
  initNodeEdit,
  submitRewording,
  commitRewording,
  updateRewording,
  electRewording,
  removeRewording,
  submitMediaRewording,
  updateMediaRewording,
  commitMediaRewording,
  // socket
  patchNodeData,
} from '../actions';

export const initialNodeState = {
  isFetchingEditInfo: false,
  isReady: false,
  fetchError: null,

  blocks: {},
  appendings: {},
  basic: null,
  title: null,
  summary: null,
  cover: null,
  contentList: null,

  activeCompoKey: undefined,
  userInvitations: [],
};

const markVersionLock = (list, id) =>
  list.map((r) => {
    if (r.id === id && !r.version_lock) {
      return {
        ...r,
        version_lock: true,
      };
    }
    return r;
  });

const nodeEditReducer = mapHandleActions(
  {
    [initNodeEdit.REQUEST]: (nodeState = initialNodeState) => ({
      ...nodeState,
      isFetchingEditInfo: true,
      fetchError: null,
    }),
    [initNodeEdit.SUCCESS]: (nodeState = initialNodeState, action) => {
      const {
        payload: { basic, title, cover, summary, blocks, contentList },
      } = action;
      invariant(contentList, 'contentList requried');
      return {
        ...nodeState,
        isReady: true,
        basic,
        title,
        cover,
        summary,
        contentList,
        blocks: {
          ...nodeState.blocks,
          ...blocks,
        },
      };
    },
    [initNodeEdit.FAILURE]: (nodeState = initialNodeState, action) => {
      const {
        payload: { data },
      } = action;
      return {
        ...nodeState,
        fetchError: data,
      };
    },
    [initNodeEdit.FULFILL]: (nodeState = initialNodeState) => ({
      ...nodeState,
      isFetchingEditInfo: false,
    }),

    [loadBlockRange]: (nodeState = initialNodeState, action) => {
      const { blocks } = action.payload;
      return {
        ...nodeState,
        blocks: {
          ...nodeState.blocks,
          ...blocks,
        },
      };
    },

    [createAppendBlock]: (nodeState = initialNodeState, action) => {
      const {
        payload: { pivotId },
      } = action;
      return {
        ...nodeState,
        appendings: {
          ...nodeState.appendings,
          [pivotId]: true,
        },
      };
    },
    [combineActions(
      commitBlock.SUCCESS,
      submitBlock.SUCCESS,
      submitMediaBlock.SUCCESS,
      commitMediaBlock.SUCCESS,
    )]: (nodeState, action) => {
      const {
        payload: { pivotId, contentList },
      } = action;
      invariant(contentList, 'contentList requried');
      // update blocks;
      const blocks = {
        ...nodeState.blocks,
        ...action.payload.blocks,
      };
      // TODO: may update nodeDesc or fetch nodeDesc...

      // cleanup appendings
      const appendings = { ...nodeState.appendings };
      delete appendings[pivotId];
      return {
        ...nodeState,
        appendings,
        contentList,
        blocks,
      };
    },
    [combineActions(
      submitRewording.SUCCESS,
      updateRewording.SUCCESS,
      commitRewording.SUCCESS,
      submitMediaRewording.SUCCESS,
      updateMediaRewording.SUCCESS,
      commitMediaRewording.SUCCESS,
      electRewording.SUCCESS,
    )]: (nodeState, action) => {
      const { blocks, blockList, contentList, structure } = action.payload;
      if (structure === 'content' || !structure) {
        invariant(contentList, 'contentList is requried');
        return {
          ...nodeState,
          contentList: contentList || nodeState.contentList,
          blocks: {
            ...nodeState.blocks,
            ...blocks,
          },
        };
      }
      return update(nodeState, {
        [structure]: {
          $set: blockList[0],
        },
        blocks: {
          $merge: blocks,
        },
      });
    },
    [combineActions(removeAppendBlock)]: (
      nodeState = initialNodeState,
      action,
    ) => {
      const {
        payload: { pivotId },
      } = action;
      const removed = { ...nodeState.appendings };
      delete removed[pivotId];
      return {
        ...nodeState,
        appendings: removed,
      };
    },

    [combineActions(removeBlock.SUCCESS, removeRewording.SUCCESS)]: (
      nodeState,
      action,
    ) => {
      const { contentList } = action.payload;
      invariant(contentList, 'contentList is requried when content updated');
      return update(nodeState, {
        basic: {
          node_paragraphs_count: {
            $set: contentList.length,
          },
        },
        contentList: { $set: contentList },
      });
    },

    [getBlockTranslation.SUCCESS]: (nodeState = initialNodeState, action) => {
      const {
        payload: { blockId, translation },
      } = action;
      const block = nodeState.blocks[blockId];
      if (!block) {
        return nodeState;
      }
      return {
        ...nodeState,
        blocks: {
          ...nodeState.blocks,
          [blockId]: {
            ...block,
            info: {
              ...(block.info || {}),
              translation,
            },
          },
        },
      };
    },

    [combineActions(likeRewording.SUCCESS, unlikeRewording.SUCCESS)]: (
      nodeState,
      action,
    ) => {
      const {
        payload: {
          // rewordingLikes,
          rewordingId,
          blockId,
        },
      } = action;
      return update(nodeState, {
        blocks: {
          [blockId]: {
            rewordings: (list) => markVersionLock(list, rewordingId),
          },
        },
        // TODO: fix user_rewording_likes
        // basic: {
        //   user_rewording_likes: (list) => [
        //     ...rewordingLikes,
        //     ...list.filter(
        //       (item) =>
        //         !rewordingLikes.some((updated) => updated.id === item.id),
        //     ),
        //   ],
        // },
      });
    },

    [combineActions(
      initBlockEdit,
      updateBlockEditor,
      initRewordingEdit,
      updateRewordingEditor,
      createAppendBlock,
      updateAppendBlock,
    )]: (nodeState = initialNodeState, action) => {
      const { type, payload } = action;
      const prefix = type.split('/')[1];
      let key;
      switch (prefix) {
        case 'BLOCK':
          key = `dimzouBlocks.${payload.structure}-${payload.blockId}`;
          break;
        case 'REWORDING':
          key = `rewordings.${payload.rewordingId}`;
          break;
        case 'APPENDING':
          key = `appendings.${payload.nodeId}.${payload.pivotId}`;
          break;
        default:
          logging.warn('Unknown Editor Block Type', type);
      }
      return nodeState.activeCompoKey === key
        ? nodeState
        : {
            ...nodeState,
            activeCompoKey: key,
          };
    },

    [combineActions(updateNodeSort.SUCCESS)]: (nodeState, action) => {
      if (nodeState && action.payload.patch) {
        return update(nodeState, {
          basic: (data) => ({
            ...data,
            ...action.payload.patch,
          }),
        });
      }
      return nodeState;
    },
    // [updateBlockSort.SUCCESS]: (nodeState, action) =>
    //   update(nodeState, {
    //     data: {
    //       $set: action.payload.data,
    //     },
    //   }),
    [combineActions(
      createRewordingComment.SUCCESS,
      markRewordShared.SUCCESS,
    )]: (nodeState, action) => {
      const {
        payload: { blockId, rewordingId },
      } = action;
      return update(nodeState, {
        blocks: {
          [blockId]: {
            rewordings: (list) => markVersionLock(list, rewordingId),
          },
        },
      });
    },
    [patchCollaborators]: (nodeState, action) => {
      const {
        payload: { collaborators },
      } = action;
      if (!nodeState) {
        return undefined;
      }
      return update(nodeState, {
        basic: (node) => {
          if (!node) {
            return undefined;
          }
          return {
            ...node,
            collaborators,
          };
        },
      });
    },
    [fetchCollaborators.TRIGGER]: (nodeState) => ({
      ...nodeState,
      collaboratorsOnceFetched: true,
    }),
    [fetchCollaborators.REQUEST]: (nodeState) => ({
      ...nodeState,
      fetchingCollaborators: true,
    }),
    [fetchCollaborators.SUCCESS]: (nodeState, action) =>
      update(nodeState, {
        basic: {
          collaborators: {
            $set: action.payload.data,
          },
        },
      }),
    [fetchCollaborators.FULFILL]: (nodeState) => ({
      ...nodeState,
      fetchingCollaborators: false,
    }),
    [fetchCollaborators.TRIGGER]: (nodeState) => ({
      ...nodeState,
      collaboratorsOnceFetched: true,
    }),
    [changeEditPermission]: (nodeState, action) => {
      const {
        payload: { editPermission },
      } = action;
      return {
        ...nodeState,
        cachedEditPermission: editPermission,
      };
    },
    [changeEditPermission.REQUEST]: (nodeState) => ({
      ...nodeState,
      isChangingEditPermission: true,
    }),
    [changeEditPermission.SUCCESS]: (nodeState, action) => {
      const {
        payload: { editPermission },
      } = action;
      return update(nodeState, {
        basic: {
          permission: { $set: editPermission },
        },
      });
    },
    [changeEditPermission.FULFILL]: (nodeState) => ({
      ...nodeState,
      isChangingEditPermission: false,
    }),
    [changeTemplate]: (nodeState, action) => {
      const {
        payload: { template },
      } = action;
      return {
        ...nodeState,
        cachedTemplate: template,
      };
    },
    [changeTemplate.REQUEST]: (nodeState) => ({
      ...nodeState,
      isChangingTemplate: true,
    }),
    [changeTemplate.SUCCESS]: (nodeState, action) => {
      const {
        payload: { data },
      } = action;
      return update(nodeState, {
        basic: {
          $merge: data,
        },
        cachedTemplate: { $set: undefined },
      });
    },
    [changeTemplate.FAILURE]: (nodeState, action) => {
      const {
        payload: { data: error },
      } = action;
      return {
        ...nodeState,
        changeChapterError: error,
      };
    },
    [changeTemplate.FULFILL]: (nodeState) => ({
      ...nodeState,
      isChangingTemplate: false,
    }),
    [createInvitation.SUCCESS]: (nodeState, action) =>
      update(nodeState, {
        userInvitations: {
          $push: [action.payload.data],
        },
      }),
    [combineActions(resetBundle, separateNode.SUCCESS)]: () => undefined,
    [patchNodeData]: (nodeState, action) => {
      const { blocks, contentList, mutators } = action.payload;
      const newState = { ...nodeState };
      if (blocks) {
        newState.blocks = {
          ...nodeState.blocks,
          ...blocks,
        };
      }
      if (contentList) {
        newState.contentList = contentList;
      }
      if (mutators) {
        return mutators.reduce(
          (prevState, mutator) => update(prevState, mutator),
          newState,
        );
      }
      return newState;
    },
  },
  undefined,
  (action) => action.payload.nodeId,
);

export default nodeEditReducer;
