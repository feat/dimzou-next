import { eventChannel } from 'redux-saga';
import {
  put,
  call,
  select,
  takeEvery,
  fork,
  take,
} from 'redux-saga/effects';
import get from 'lodash/get';
import Router from 'next/router';
import { normalize } from 'normalizr';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';

import { 
  category as categorySchema,
  dimzouBundleDesc as dimzouBundleDescSchema,
  dimzouNodeDesc as dimzouNodeDescSchema,
} from '@/schema';
import ApiError from '@/errors/ApiError';

import notification from '@feat/feat-ui/lib/notification';

import {
  getBundleEditInfo as getBundleEditInfoRequest,
  updateNodeSort as updateNodeSortRequest,
  setChapterNode as setChapterNodeRequest,
  setCoverNode as setCoverNodeRequest,
  getBundleDesc as getBundleDescRequest,
} from '../requests';

import {
  fetchBundleEditInfo,
  loadBundleEditInfo,
  fetchBundleEditInfoFailure,
  receiveBundleConfigPatch,
  initBundle,
  updateNodeSort,
  patchNodes,
  // receiveNewNode,
  // receiveNodeDescInfo,
  receiveNodeUpdateSignal,
  receiveNewNode,
  receiveNodeDescInfo,

  bundleUpdateSingal,
  mergeBundlePatch,
  separateChapterPatch,
  newBundlePatch,

  // node update signal
  editPatchSignal,

  commentSignal,
  likeSignal,
  patchContent,
  changeTemplate,
  receiveCollaboratorPatch,
  fetchNodeEditInfo,
  updateBundleDesc,
} from '../actions';


import {
  selectBundleState,
  selectNodeData,
  selectNodeState,
} from '../selectors';
import {
  ACTION_UPDATE_COLLABORATOR,
  ACTION_ADD_COLLABORATOR,
  ACTION_CHANGE_TEMPLATE,
  NODE_TYPE_COVER,
  NODE_TYPE_CHAPTER,
  // ACTION_CHANGE_EDIT_PERMISSION,
  structureMap,
} from '../constants';

import dimzouSocket from '../socket';

function joinBundleChannel(bundleId) {
  logging.debug('joinBundleChannel', bundleId);
  dimzouSocket.private(`dimzou-bundle-${bundleId}`);
}

function* initBundleFlow(action) {
  const { payload } = action;
  const { bundleId, nodeId } = payload;
  const bundleEditState = yield select((state) =>
    selectBundleState(state, payload),
  );
  if (bundleEditState && bundleEditState.isFetchingEditInfo) {
    return;
  }
  try {
    yield put(fetchBundleEditInfo({ bundleId }));
    const params = nodeId ? { node: nodeId } : {};
    params.invitation = payload.invitationCode;
    const { data } = yield call(getBundleDescRequest, bundleId, params);
  
    // fix category
    if (data.category_id && !data.category) {
      data.category = yield select((state) =>
        get(
          state,
          ['entities', categorySchema.key, data.category_id],
          undefined,
        ),
      );
    }
    const normalized = normalize(data, dimzouBundleDescSchema);
    yield put(
      loadBundleEditInfo({
        bundleId: data.id,
        userId: data.user_id,
        data,
        entities: normalized.entities,
      }),
    );
    yield fork(joinBundleChannel, bundleId);
  } catch (err) {
    yield put(
      fetchBundleEditInfoFailure({
        bundleId,
        data: err,
      }),
    );
    // invalid nodeId, node may be deleted.
    if (err.code === 'VALIDATION_EXCEPTION' && nodeId) {
      const nextPayload = { ...payload };
      delete nextPayload.nodeId;
      yield put(initBundle(nextPayload));
    } else {
      if (!(err instanceof ApiError)) {
        logging.error(err);
      }
      notification.error({
        message: 'Error',
        description: err.message,
      });
      yield put(
        fetchNodeEditInfo.failure({
          bundleId,
          nodeId,
          data: err,
        })
      )
    }
  } finally {
    // 定位文章段落位置；
    // const hash = window.location.hash;
    // window.location.hash = '';
    // window.location.hash = hash;
    logging.debug('finished');
  }
}


function* handleBundleConfigPatch(action) {
  const {
    payload: { bundleId, data },
  } = action;
  switch (data.method) {
    case ACTION_CHANGE_TEMPLATE:
      yield put(
        changeTemplate.success({
          bundleId,
          config: data,
        }),
      );
      break;
    default:
      logging.warn('Not Handled Config', data);
  }
}

function getBundleId(roomId) {
  const matches = /private-dimzou-bundle-(.*)/.exec(roomId);
  if (!matches) {
    return false;
  }
  return matches[1];
}

function getNodeId(roomId) {
  const matches = /private-dimzou-node-(.*)/.exec(roomId);
  if (!matches) {
    return false;
  }
  return matches[1];
}
function getUserId(roomId) {
  const matches = /private-dimzou-user-(.*)/.exec(roomId);
  if (!matches) {
    return false;
  }
  return matches[1];
}

function* listenDimzouSocket() {
  const channel = eventChannel((emitter) => {
    dimzouSocket.connect();
    // bundle level
    dimzouSocket.on('dimzou.edit.collaborator-updated', (room, data) => {
      const bundleId = getBundleId(room);
      if (!bundleId) {
        return;
      }
      const action = receiveCollaboratorPatch({
        bundleId,
        nodeId: data.node_id,
        data: {
          method: ACTION_UPDATE_COLLABORATOR,
          payload: data,
        },
      });
      logging.debug(action);
      emitter(action);
    });
    dimzouSocket.on('dimzou.edit.new-collaborator', (room, data) => {
      const bundleId = getBundleId(room);
      if (!bundleId) {
        return;
      }
      const action = receiveCollaboratorPatch({
        bundleId,
        nodeId: data.node_id,
        data: {
          method: ACTION_ADD_COLLABORATOR,
          payload: data,
        },
      });
      logging.debug(action);
      emitter(action);
    });

    dimzouSocket.on('dimzou.edit.node-created', (room, data) => {
      const bundleId = getBundleId(room);
      if (!bundleId) {
        return;
      }
      const action = receiveNewNode({
        bundleId,
        data: [data],
        entityMutators: [
          {
            [dimzouBundleDescSchema.key]: {
              [bundleId]: {
                nodes: (list = []) => 
                  sortBy(uniqBy([...list, data], 'id'), [
                    'sort',
                  ]),
              },
            },
          },
        ],
      });
      emitter(action);
    });
    dimzouSocket.on('dimzou.edit.node-desc-updated', (room, data) => {
      const bundleId = getBundleId(room);
      if (!bundleId) {
        return;
      }
      const normalized = normalize(data, dimzouNodeDescSchema);
      const action = receiveNodeDescInfo({
        bundleId,
        data,
        entities: normalized.entities,
      });
      emitter(action);
    });
    dimzouSocket.on('dimzou.edit.nodes-updated', (room, data) => {
      const bundleId = getBundleId(room);
      if (!bundleId) {
        return;
      }
      const normalized = normalize(data.data, [dimzouNodeDescSchema]);
      const action = patchNodes({
        bundleId,
        nodes: data.data,
        entityMutators: [
          {
            [dimzouBundleDescSchema.key]: {
              [bundleId]: {
                nodes: {
                  $set: normalized.result,
                },
              },
            },
          },
        ],
        entities: normalized.entities,
      });
      emitter(action);
    });
    // node level
    dimzouSocket.on('dimzou.edit.node-patch', (room, msg) => {
      emitter(
        receiveNodeUpdateSignal({
          bundleId: msg.bundle_id,
          nodeId: msg.node_id,
        }),
      );
    });
    dimzouSocket.on('dimzou.edit.paragraph-updated', (room, msg) => {
      const nodeId = getNodeId(room);
      emitter(
        editPatchSignal({
          nodeId,
          patch: msg.paragraphs,
          method: 'submit-content',
          structure: structureMap[msg.paragraphs[0].type],
        })
      )
    });
    dimzouSocket.on('dimzou.edit.paragraph-sorting', (room, msg) => {
      const nodeId = getNodeId(room);
      emitter(
        editPatchSignal({
          nodeId,
          patch: {
            blockId: msg.paragraph_id,
            oldSort: msg.old_sort,
            newSort: msg.new_sort,
          },
          method: 'reorder',
        })
      )
    });
    dimzouSocket.on('dimzou.edit.paragraph-created', (room, msg) => {
      const nodeId = getNodeId(room);
      emitter(
        editPatchSignal({
          nodeId,
          method: 'insert-content',
          patch: msg.paragraphs,
          structure: 'content',
        })
      )
    });
    dimzouSocket.on('dimzou.edit.paragraph-deleted', (room, msg) => {
      const nodeId = getNodeId(room);
      emitter(
        editPatchSignal({
          nodeId,
          method: 'remove-content',
          patch: {
            blockId: msg.paragraph_id,
          },
          structure: 'content',
        })
      )
    });

    dimzouSocket.on('dimzou.edit.comment-signal', (room, data) => {
      const nodeId = getNodeId(room);
      if (!nodeId) {
        return;
      }
      emitter(
        commentSignal({
          nodeId,
          data,
        }),
      );
    });
    dimzouSocket.on('dimzou.edit.like-signal', (room, data) => {
      const nodeId = getNodeId(room);
      if (!nodeId) {
        return;
      }
      emitter(
        likeSignal({
          nodeId,
          data,
        }),
      );
    });
    dimzouSocket.on('dimzou.user.bundle-updated', (room, data) => {
      const userId = getUserId(room);
      if (!userId) {
        return;
      }
      emitter(
        bundleUpdateSingal({
          userId,
          data,
        })
      )
    })

    return () => {
      dimzouSocket.disconnect();
    };
  });
  try {
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  } finally {
    channel.close();
  }
}

function* tryToFetchUpdatedInfo(action) {
  logging.debug('tryToFetchUpdatedInfo');
  const { payload } = action;
  const node = yield select((state) => selectNodeData(state, payload));
  if (!node) {
    return;
  }
  try {
    const {
      data: { node: updatedNode },
    } = yield call(getBundleEditInfoRequest, payload.bundleId, {
      node: payload.nodeId,
    });
    yield put(
      patchContent({
        ...payload,
        data: updatedNode,
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
  }
}

function* updateNodeSortFlow(action) {
  const {
    payload: { bundleId, patch },
  } = action;
  try {
    if (patch.to_chapter) {
      const { data } = yield call(setChapterNodeRequest, bundleId, {
        node_id: patch.nodeId,
        new_sort: patch.sort,
      });
      yield put(
        updateNodeSort.success({
          bundleId,
          nodeId: patch.nodeId,
          patch: {
            sort: patch.sort,
            type: NODE_TYPE_CHAPTER,
          },
        }),
      );
      logging.debug(data);
    } else if (patch.to_cover) {
      const { data } = yield call(setCoverNodeRequest, bundleId, {
        node_id: patch.nodeId,
      });
      logging.debug(data);
      yield put(
        updateNodeSort.success({
          bundleId,
          nodeId: patch.nodeId,
          patch: {
            type: NODE_TYPE_COVER,
          },
        }),
      );
    } else {
      const { data } = yield call(updateNodeSortRequest, bundleId, {
        node_id: patch.nodeId,
        new_sort: patch.sort,
      });
      const normalized = normalize(data, [dimzouNodeDescSchema]);
      yield put(
        updateNodeSort.success({
          bundleId,
          nodeId: patch.nodeId,
          patch: {
            sort: patch.sort,
          },
          entities: normalized.entities,
        })
      )
    }
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
  }
}

function* newBundleFlow(action) {
  const {
    data: {
      bundle: {
        id: bundleId,
      },
    },
    userId,
  } = action.payload;
  try {
    const { data } = yield call(getBundleDescRequest, bundleId);
    const normalized = normalize(data, dimzouBundleDescSchema);
    yield put(newBundlePatch({
      userId,
      bundleId: data.id,
      entities: normalized.entities,
    }))
  } catch (err) {
    logging.debug(err);
  } finally {
    // TODO
  }
}

function* workshopUpdateFlow(action) {
  const { data: { action: updateType, bundle }} = action.payload;
  switch (updateType) {
    case 'merge_bundle':
      yield call(mergeBundleFlow, action);
      break;
    case 'separate_chapter':
      yield call(separateChapterFlow, action);
      break;
    case 'create_bundle':
      yield call(newBundleFlow, action);
      break;
    case 'update_bundle':
      yield put(updateBundleDesc({
        entityMutators: [
          {
            [dimzouBundleDescSchema.key]: {
              [bundle.id]: (base) => {
                if (!base) {
                  return base;
                }
                return ({
                  ...base,
                  title: bundle.title,
                  summary: bundle.summary,
                })
              },
            },
          },
        ],
      }))
      break;
    default: 
      logging.warn(action);
  }
}

function* mergeBundleFlow(action) {
  const { data: {
    node_id: nodeId,
    merged_bundle_id: mergedBundleId,
    target_bundle_id: targetBundleId,
  }, userId } = action.payload;

  // if loaded, reload data.
  const nodeState = yield select((state) => selectNodeState(state, { nodeId }));
  const bundles = [];
  if (nodeState) {
    yield call(initBundleFlow, initBundle({
      bundleId: targetBundleId,
      nodeId,
    }));
  } else {
    const { data } = yield call(getBundleDescRequest, targetBundleId);
    bundles.push(data);
  }
  const normalized = normalize(bundles, [dimzouBundleDescSchema]);
  yield put(mergeBundlePatch({
    userId,
    nodeId,
    mergedBundleId,
    targetBundleId,
    entities: normalized.entities,
  }))

  // try to sync route
  // if (String(Router.query.bundleId) === String(mergedBundleId)) {
  //   Router.replace({
  //     pathname: '/dimzou-edit',
  //     query: {
  //       ...Router.query,
  //       bundleId: targetBundleId,
  //       nodeId,
  //     },
  //   }, `/draft/${targetBundleId}/${nodeId}`);
  // }
} 

function* separateChapterFlow(action) {
  const {
    userId,
    data: {
      node_id: nodeId,
      separate_bundle_id: originBundleId,
      new_bundle: {
        id: newBundleId,
      },
    },
  } = action.payload;

  // if loaded then update node data,
  const nodeState = yield select((state) => selectNodeState(state, { nodeId }));
  const bundles = [];
  if (nodeState) {
    yield call(initBundleFlow, initBundle({
      bundleId: newBundleId,
      nodeId,
    }));
  } else {
    const { data } = yield call(getBundleDescRequest, newBundleId);
    bundles.push(data);
  }
  const { data } = yield call(getBundleDescRequest, originBundleId);
  bundles.push(data);
  const normalized = normalize(bundles, [dimzouBundleDescSchema]);
  yield put(
    separateChapterPatch({
      userId,
      nodeId,
      bundleId: newBundleId,
      entities: normalized.entities,
    })
  )

  if (String(Router.query.nodeId) === String(nodeId)) {
    Router.replace({
      pathname: '/dimzou-edit',
      query: {
        ...Router.query,
        bundleId: newBundleId,
        nodeId,
      },
    }, `/draft/${newBundleId}/${nodeId}`);
  }
}

export default function* dimzouBundleSaga() {
  yield takeEvery(initBundle, initBundleFlow);
  yield takeEvery(receiveBundleConfigPatch, handleBundleConfigPatch);
  yield takeEvery(receiveNodeUpdateSignal, tryToFetchUpdatedInfo);
  yield takeEvery(bundleUpdateSingal, workshopUpdateFlow);
  yield takeEvery(updateNodeSort, updateNodeSortFlow);
  yield fork(listenDimzouSocket);
}