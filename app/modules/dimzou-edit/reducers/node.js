import { combineActions } from 'redux-actions';
import update from 'immutability-helper';

import { mapHandleActions } from '@/utils/reducerCreators';

import {
  updateNodeSort,
  resetBundle,
  fetchNodeEditInfo,
  loadNodeEditInfo,
  updateNodeInfo,
  patchContent,
  fetchNodeData,
  commitBlock,
  submitBlock,
  submitMediaBlock,
  commitMediaBlock,
  updateBlockSort,
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
  // comment
  createRewordingComment,
  markRewordShared,
  // rewording
  initRewordingEdit,
  updateRewordingEditor,
  separateNode,
  setLoadingProgress,
} from '../actions';

export const initialNodeState = {
  isFetchingEditInfo: false,
  isReady: false,
  fetchError: null,

  appendings: {},
  data: null,

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
    [setLoadingProgress]: (nodeState, action) => ({
      ...nodeState,
      loadingProgress: action.payload.progress,
    }),
    [fetchNodeEditInfo.REQUEST]: (nodeState = initialNodeState) => ({
      ...nodeState,
      isFetchingEditInfo: true,
      fetchError: null,
    }),
    [loadNodeEditInfo]: (nodeState = initialNodeState, action) => {
      const {
        payload: { data },
      } = action;
      return {
        ...nodeState,
        isReady: true,
        data,
      };
    },
    [fetchNodeEditInfo.FAILURE]: (nodeState = initialNodeState, action) => {
      const {
        payload: { data },
      } = action;
      return {
        ...nodeState,
        fetchError: data,
      };
    },

    [fetchNodeEditInfo.FULFILL]: (nodeState = initialNodeState) => ({
      ...nodeState,
      isFetchingEditInfo: false,
    }),

    [updateNodeInfo]: (nodeState = initialNodeState, action) => {
      const {
        data: { content },
      } = action.payload;
      return update(nodeState, {
        data: (data) => {
          const hash = {};
          const tempList = [...data.content, ...content]
            .sort((a, b) => a.sort - b.sort)
            .reduce((acc, cur) => {
              // eslint-disable-next-line no-unused-expressions
              hash[cur.id] ? '' : (hash[cur.id] = true && acc.push(cur));
              return acc;
            }, []);
          return {
            ...data,
            content: tempList,
          };
        },
      });
    },

    [fetchNodeData]: (nodeState = initialNodeState, action) => {
      const {
        payload: { nodeData },
      } = action;
      return update(nodeState, {
        data: (data) => {
          const tempData = { ...data, ...nodeData };
          return tempData;
        },
      });
    },

    [patchContent]: (nodeState = initialNodeState, action) => {
      const {
        payload: { data },
      } = action;
      // return {
      //   ...nodeState,
      //   data,
      // };
      return update(nodeState, {
        data: (d) => {
          const tempData = { ...d, ...data };
          return tempData;
        },
      });
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
      removeAppendBlock,
      commitBlock.SUCCESS,
      submitBlock.SUCCESS,
      submitMediaBlock.SUCCESS,
      commitMediaBlock.SUCCESS,
    )]: (nodeState = initialNodeState, action) => {
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

    [getBlockTranslation.SUCCESS]: (nodeState = initialNodeState, action) => {
      const {
        payload: { structure, blockId, translation },
      } = action;
      const newData = { ...nodeState.data };
      if (structure === 'title') {
        newData.title = {
          ...newData.title,
          info: {
            ...(newData.title.info ? newData.title.info : {}),
            translation,
          },
        };
      } else if (structure === 'summary') {
        newData.summary = {
          ...newData.summary,
          info: {
            ...(newData.summary.info ? newData.summary.info : {}),
            translation,
          },
        };
      } else if (structure === 'content') {
        newData.content = newData.content.map((item) => {
          if (item.id === blockId) {
            return {
              ...item,
              info: {
                ...(item.info ? item.info : {}),
                translation,
              },
            };
          }
          return item;
        });
      }

      return {
        ...nodeState,
        data: newData,
      };
    },

    [combineActions(likeRewording.SUCCESS, unlikeRewording.SUCCESS)]: (
      nodeState,
      action,
    ) => {
      const {
        payload: { rewordingLikes, structure, rewordingId, blockId },
      } = action;
      return update(nodeState, {
        data: {
          [structure]: (info) => {
            if (Array.isArray(info)) {
              return info.map((b) => {
                if (b.id === blockId) {
                  return {
                    ...b,
                    rewordings: markVersionLock(b.rewordings, rewordingId),
                  };
                }
                return b;
              });
              // content;
            }
            return {
              ...info,
              rewordings: markVersionLock(info.rewordings, rewordingId),
            };
          },
          user_rewording_likes: (list) => [
            ...rewordingLikes,
            ...list.filter(
              (item) =>
                !rewordingLikes.some((updated) => updated.id === item.id),
            ),
          ],
        },
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
          data: (data) => ({
            ...data,
            ...action.payload.patch,
          }),
        });
      }
      return nodeState;
    },
    [updateBlockSort.SUCCESS]: (nodeState, action) =>
      update(nodeState, {
        data: {
          $set: action.payload.data,
        },
      }),
    [combineActions(
      createRewordingComment.SUCCESS,
      markRewordShared.SUCCESS,
    )]: (nodeState, action) => {
      const {
        payload: { structure, blockId, rewordingId },
      } = action;
      return update(nodeState, {
        data: {
          [structure]: (info) => {
            if (Array.isArray(info)) {
              return info.map((b) => {
                if (b.id === blockId) {
                  return {
                    ...b,
                    rewordings: markVersionLock(b.rewordings, rewordingId),
                  };
                }
                return b;
              });
              // content;
            }
            return {
              ...info,
              rewordings: markVersionLock(info.rewordings, rewordingId),
            };
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
        data: (node) => {
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
        data: {
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
        data: {
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
        data: {
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
  },
  undefined,
  (action) => action.payload.nodeId,
);

export default nodeEditReducer;
