import {
  put,
  call,
  select,
  takeEvery,
  takeLatest,
  fork,
  delay,
  all,
} from 'redux-saga/effects';
// import { eventChannel } from 'redux-saga';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import Router from 'next/router';

import ApiError from '@/errors/ApiError';

import { selectCurrentUser } from '@/modules/auth/selectors';

import notification from '@feat/feat-ui/lib/notification';

import {
  initNodeEdit,
  patchNodeData,
  likeSignal,
  commentSignal,
  // asyncFetchNodeEditInfo,
  commitBlock,
  submitBlock,
  removeBlock,
  updateBlockSort,
  commitRewording,
  submitRewording,
  rejectRewording,
  electRewording,
  updateRewording,
  removeRewording,
  submitMediaBlock,
  commitMediaBlock,
  updateMediaRewording,
  commitMediaRewording,
  submitMediaRewording,

  // edit signal
  editPatchSignal,
  addCollaborator,
  updateCollaborator,
  removeCollaborator,
  patchCollaborators,
  receiveCollaboratorPatch,
  changeEditPermission,
  changeTemplate,
  // block
  initBlockEditWithTranslation,
  getBlockTranslation,
  initBlockEdit,
  createAppendBlock,
  // link
  likeRewording,
  unlikeRewording,
  updateAppendBlock,
  removeAppendBlock,
  updateRewordingEditor,
  initRewordingEdit,
  exitRewordingEdit,
  updateBlockEditor,
  exitBlockEdit,
} from '../actions';

import {
  getNodeBasic as getNodeBasicRequest,
  getNodeContentIds as getNodeContentIdsRequest,
  getNodeTitleSummaryCover as getNodeTitleSummaryCoverRequest,
  getBlockTranslation as getBlockTranslationRequest,
  likeRewording as likeRewordingRequest,
  unlikeRewording as unlikeRewordingRequest,
  insertMediaBlock as insertMediaBlockRequest,
  insertContent as insertContentRequest,
  submitEdit as submitEditRequest,
  submitMediaEdit as submitMediaEditRequest,
  submitCover as submitCoverRequest,
  checkEdit as checkEditRequest,
  removeContent as removeContentRequest,
  updateBlockSort as updateBlockSortRequest,
  // collaborator
  addCollaborator as addCollaboratorRequest,
  updateCollaborator as updateCollaboratorRequest,
  removeCollaborator as removeCollaboratorRequest,
  // update config
  updateChapter as updateChapterRequest,
} from '../requests';

import {
  selectNodeState,
  selectNodeBasic,
  selectBundleData,
  selectNodeCollaborators,
} from '../selectors';

import {
  tryToFetchNewComment,
  tryToFetchUpdatedComment,
  handleCommentDeleted,
} from './comment';

import { createFromHTML, getHTML } from '../components/DimzouEditor';
import {
  // BEGINNING_PIVOT,
  ACTION_SUBMIT_BLOCK,
  ACTION_COMMIT_BLOCK,
  ACTION_UPDATE_REWORDING,
  ACTION_COMMIT_REWORDING,
  ACTION_SUBMIT_REWORDING,
  // ACTION_ELECT_REWORDING,
  // ACTION_REJECT_REWORDING,
  // ACTION_REMOVE_BLOCK,
  BEGINNING_PIVOT,
  // NODE_STRUCTURE_CONTENT,
  NODE_STRUCTURE_TITLE,
  NODE_STRUCTURE_SUMMARY,
  NODE_STRUCTURE_COVER,
  structureMap,
  NODE_TYPE_COVER,
  ACTION_UPDATE_COLLABORATOR,
  ACTION_ADD_COLLABORATOR,
  ACTION_REMOVE_COLLABORATOR,
  TAILING_PIVOT,

  // ROLE_ADMIN,
} from '../constants';

import {
  getConfirmedText,
  mapArray,
  // splitContent
} from '../utils/content';
import { getRewordType } from '../utils/rewordings';

import {
  getNodeCache,
  appendingBlockKey,
  rewordingKey,
  blockKey,
} from '../utils/cache';

import dimzouSocket from '../socket';

function* initNodeFlow(action) {
  const { payload } = action;
  const { bundleId, nodeId, invitationCode } = payload;
  const nodeState = yield select((state) => selectNodeState(state, payload));
  if (nodeState && nodeState.isFetchingEditInfo) {
    return;
  }
  try {
    yield put(initNodeEdit.request(payload));
    const [
      { data: basic },
      {
        data: {
          [NODE_STRUCTURE_TITLE]: title,
          [NODE_STRUCTURE_SUMMARY]: summary,
          [NODE_STRUCTURE_COVER]: cover,
        },
      },
      { data: contentList },
    ] = yield all([
      getNodeBasicRequest(bundleId, {
        node: nodeId,
        invitation: invitationCode,
      }),
      getNodeTitleSummaryCoverRequest(nodeId),
      getNodeContentIdsRequest({
        node: nodeId,
        invitation: invitationCode,
      }),
    ]);
    // console.log(basic, title, summary, cover);
    const blocks = {};
    if (title) {
      blocks[title.id] = title;
    }
    if (summary) {
      blocks[summary.id] = summary;
    }
    if (cover) {
      blocks[cover.id] = cover;
    }

    yield put(
      initNodeEdit.success({
        ...payload,
        basic,
        title: title ? title.id : undefined,
        summary: summary ? summary.id : undefined,
        cover: cover ? cover.id : undefined,
        contentList,
        blocks,
      }),
    );
  } catch (err) {
    yield put(
      initNodeEdit.failure({
        ...payload,
        data: err,
      }),
    );
  } finally {
    yield put(initNodeEdit.fulfill(payload));
  }
}

function joinNodeChannel(action) {
  const {
    payload: { nodeId },
  } = action;
  if (nodeId) {
    dimzouSocket.private(`dimzou-node-${nodeId}`);
  } else {
    logging.warn(`NO_NODE_ID_PROVIDED: bundleId: ${action.payload.bundleId}`);
  }
}

function* handleCommentSignal(action) {
  const status = get(action, 'payload.data.status');
  switch (status) {
    case 'created':
      yield fork(tryToFetchNewComment, action);
      break;
    case 'updated':
      yield fork(tryToFetchUpdatedComment, action);
      break;
    case 'deleted':
      yield fork(handleCommentDeleted, action);
      break;
    default:
      logging.warn('comment_signal not handled', action.payload);
  }
}

function* handleLikeSignal(action) {
  const status = get(action, 'payload.data.status');
  const { data, nodeId } = action.payload;
  const likeRecord = {
    id: data.id,
    user: data.user,
    rewording_id: data.object_id,
    create_time: data.created_at,
    last_modified: data.updated_at,
    deleted_at: data.deleted_at,
  };
  const structure =
    structureMap[get(action, 'payload.data.meta.paragraph_type')];
  const blockId = get(action, 'payload.data.meta.paragraph_id');
  const rewordingLikesCount = get(action, 'payload.data.rewording_likes_count');
  const currentUser = yield select(selectCurrentUser);
  const rewordingLikes = [likeRecord];
  const currentUserLikes = rewordingLikes.filter(
    (like) => like.user_id === currentUser.uid,
  );

  try {
    switch (status) {
      case 'created':
        yield put(
          likeRewording.success({
            nodeId,
            structure,
            blockId,
            rewordingId: data.object_id,
            rewordingLikes: currentUserLikes,
            rewordingLikesCount,
          }),
        );
        break;
      case 'deleted':
        yield put(
          unlikeRewording.success({
            nodeId,
            structure,
            blockId,
            rewordingId: data.object_id,
            rewordingLikes: currentUserLikes,
            rewordingLikesCount,
          }),
        );
        break;
      default:
        logging.warn('like_signal not handled', action.payload);
    }
  } catch (err) {
    logging.error(err);
  }
}

// function hasRewordingLikeInfo(data) {
//   return (
//     data.payload &&
//     (data.payload.rewording_like || data.payload.rewording_likes)
//   );
// }

const mapLikeInfo = (likeInfo) => ({
  id: likeInfo.id,
  rewording_id: likeInfo.object_id,
  create_time: likeInfo.create_time,
  last_modified: likeInfo.last_modified,
  deleted_at: likeInfo.deleted_at,
});

function* likeRewordingAsync(action) {
  const {
    payload: { nodeId, rewordingId, blockId, structure },
  } = action;
  try {
    const { data, meta } = yield call(likeRewordingRequest, {
      node_id: nodeId,
      rewording_id: rewordingId,
    });
    const rewordingLikesCount = meta.rewording_likes_count;
    const rewordingLikes = [mapLikeInfo(data)];

    // const rewordingLikes = payload.rewording_likes || [payload.rewording_like];
    yield put(
      likeRewording.success({
        nodeId,
        structure,
        blockId,
        rewordingId,
        rewordingLikes,
        rewordingLikesCount,
      }),
    );
  } catch (err) {
    // console.log(err);
    yield put(
      likeRewording.failure({
        rewordingId,
        nodeId,
        data: err,
      }),
    );
  } finally {
    yield put(
      likeRewording.fulfill({
        rewordingId,
        nodeId,
      }),
    );
  }
}

function* unlikeRewordingAsync(action) {
  const {
    payload: { nodeId, rewordingId, blockId, structure },
  } = action;
  try {
    const { data, meta } = yield call(unlikeRewordingRequest, {
      node_id: nodeId,
      rewording_id: rewordingId,
    });
    const rewordingLikesCount = meta.rewording_likes_count;
    const rewordingLikes = [mapLikeInfo(data)];
    yield put(
      unlikeRewording.success({
        nodeId,
        structure,
        blockId,
        rewordingId,
        rewordingLikes,
        rewordingLikesCount,
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
    yield put(
      unlikeRewording.failure({
        rewordingId,
        nodeId,
        data: err,
      }),
    );
  } finally {
    yield put(
      unlikeRewording.fulfill({
        rewordingId,
        nodeId,
      }),
    );
  }
}

function* initBlockEditWithTranslationFlow(action) {
  const {
    payload: { bundleId, nodeId, blockId, structure },
  } = action;
  let { translation } = action.payload;
  if (!translation) {
    try {
      yield put(
        getBlockTranslation.request({
          structure,
          nodeId,
          blockId,
        }),
      );
      const { data } = yield call(getBlockTranslationRequest, {
        bundleId,
        nodeId,
        structure,
        blockId,
      });
      // eslint-disable-next-line
      translation = data.translation;
      yield put(
        getBlockTranslation.success({
          bundleId,
          nodeId,
          structure,
          blockId,
          translation,
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
  yield put(
    initBlockEdit({
      bundleId,
      nodeId,
      structure,
      blockId,
      editorMode: 'create',
      editorState: createFromHTML(translation),
      basedOn: 0,
    }),
  );
}

/**
 * Block Actions
 */

function* insertContentFlow(action, routine) {
  const { payload } = action;
  const {
    content,
    htmlContent,
    bundleId,
    nodeId,
    cacheKey,
    isTailing,
  } = payload;

  yield put(routine.request(payload));

  // user insert
  let params;
  if (isTailing) {
    params = {
      is_tailing: true,
      content: getConfirmedText(htmlContent),
      html_content: htmlContent,
      content_meta: content,
    };
  } else if (payload.pivotId === BEGINNING_PIVOT) {
    params = {
      is_first: 'true',
      content: getConfirmedText(htmlContent),
      html_content: htmlContent,
      content_meta: content,
    };
  } else {
    params = {
      paragraph_id: payload.pivotId,
      content: getConfirmedText(htmlContent),
      html_content: htmlContent,
      content_meta: content,
    };
  }
  try {
    const { data } = yield call(insertContentRequest, bundleId, nodeId, params);
    if (cacheKey) {
      const cache = getNodeCache(nodeId);
      cache.remove(cacheKey);
    }
    // const node = yield select((state) =>
    //   selectNodeData(state, { bundleId, nodeId }),
    // );

    const [blockList, blocks] = mapArray(Array.isArray(data) ? data : [data]);
    const { data: contentList } = yield call(getNodeContentIdsRequest, {
      node: payload.nodeId,
    });

    yield put(
      routine.success({
        ...payload,
        blockList,
        blocks,
        contentList,
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
    yield put(
      routine.failure({
        ...payload,
        data: err,
      }),
    );
  } finally {
    yield put(routine.fulfill(payload));
  }
}

function* commitBlockAsync(action) {
  yield call(insertContentFlow, action, commitBlock, ACTION_SUBMIT_BLOCK);
}

function* submitBlockAsync(action) {
  // check auth status
  const currentUser = yield select(selectCurrentUser);
  if (!currentUser.uid) {
    Router.push({
      pathname: '/auth/login',
      query: {
        redirect: window.location.href,
        action: true,
      },
    });
    return;
  }
  yield call(insertContentFlow, action, submitBlock, ACTION_SUBMIT_BLOCK);
}

/**
 * Rewording actions
 */
function* submitCoverFlow(action, routine) {
  const { payload } = action;
  const params = {
    img: payload.sourceImage,
    crop_img: payload.croppedImage,
    template_config: get(payload.content, 'templates'),
  };
  if (!payload.sourceImage) {
    params.reword_id = payload.baseId;
  }

  yield put(routine.request(payload));
  try {
    const { data } = yield call(
      submitCoverRequest,
      payload.bundleId,
      payload.nodeId,
      params,
    );
    yield put(
      routine.success({
        ...payload,
        blockList: [data.id],
        blocks: {
          [data.id]: data,
        },
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
    yield put(
      routine.failure({
        ...payload,
        data: err,
      }),
    );
  } finally {
    yield put(routine.fulfill(payload));
  }
}

function* submitEditFlow(action, routine) {
  const { payload } = action;
  const params = {
    reword_type: getRewordType(payload.structure),
    paragraph_id: payload.blockId,
    content: getConfirmedText(payload.htmlContent),
    html_content: payload.htmlContent,
    content_meta: payload.content,
    base_on: payload.baseId === 0 ? null : payload.baseId,
  };
  yield put(routine.request(payload));
  try {
    const { data } = yield call(
      submitEditRequest,
      payload.bundleId,
      payload.nodeId,
      params,
    );
    const [blockList, blocks] = mapArray(data.sort((a, b) => a.sort - b.sort));
    const { data: contentList } = yield call(getNodeContentIdsRequest, {
      node: payload.nodeId,
    });
    yield put(
      routine.success({
        ...payload,
        blocks,
        blockList,
        contentList,
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
    yield put(
      routine.failure({
        ...payload,
        data: err,
      }),
    );
  } finally {
    yield put(routine.fulfill(payload));
  }
}

function* commitRewordingAsync(action) {
  const { payload } = action;
  if (payload.structure === 'cover') {
    yield call(
      submitCoverFlow,
      action,
      commitRewording,
      ACTION_COMMIT_REWORDING,
    );
  } else {
    yield call(
      submitEditFlow,
      action,
      commitRewording,
      ACTION_COMMIT_REWORDING,
    );
  }
}

function* submitRewordingAsync(action) {
  // check auth status
  const currentUser = yield select(selectCurrentUser);
  if (!currentUser.uid) {
    Router.push({
      pathname: '/auth/login',
      query: {
        redirect: window.location.href,
        action: true,
      },
    });
    return;
  }
  const { payload } = action;
  if (payload.structure === 'cover') {
    yield call(
      submitCoverFlow,
      action,
      submitRewording,
      ACTION_SUBMIT_REWORDING,
    );
  } else {
    yield call(
      submitEditFlow,
      action,
      submitRewording,
      ACTION_SUBMIT_REWORDING,
    );
  }
}

function* removeRewordingAsync(action) {
  const { payload } = action;
  // select block data;
  try {
    yield put(removeRewording.request(payload));
    yield call(removeContentRequest, payload.bundleId, payload.nodeId, {
      paragraph_id: payload.blockId,
      rewording_id: payload.rewordingId,
    });
    const { data: contentList } = yield call(getNodeContentIdsRequest, {
      node: payload.nodeId,
    });
    yield put(
      removeRewording.success({
        ...payload,
        contentList,
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    yield put(removeRewording.failure(payload));
  } finally {
    yield put(removeRewording.fulfill(payload));
  }
}

function* updateRewordingAsync(action) {
  const { payload } = action;
  if (payload.structure === 'cover') {
    yield call(
      submitCoverFlow,
      action,
      updateRewording,
      ACTION_UPDATE_REWORDING,
    );
  } else {
    yield call(
      submitEditFlow,
      action,
      updateRewording,
      ACTION_UPDATE_REWORDING,
    );
  }
}

function* checkEditFlow(action, routine, method) {
  const { payload } = action;

  yield put(routine.request(payload));

  try {
    const { data } = yield call(
      checkEditRequest,
      payload.bundleId,
      payload.nodeId,
      {
        action: method,
        reword_type: getRewordType(payload.structure),
        reword_id: payload.rewordingId,
      },
    );
    const [blockList, blocks] = mapArray(data);
    const { data: contentList } = yield call(getNodeContentIdsRequest, {
      node: payload.nodeId,
    });
    yield put(
      routine.success({
        ...payload,
        blocks,
        blockList,
        contentList,
      }),
    );
  } catch (err) {
    if (err.code === 'INVALID_REWORD_STATUS') {
      notification.error({
        message: 'Warning',
        description: err.message,
      });
      yield put(
        patchNodeData({
          bundleId: payload.bundleId,
          nodeId: payload.nodeId,
          mutators: [
            {
              [payload.blockId]: {
                rewordings: (rewordings) =>
                  rewordings.map((r) => {
                    if (r.id === err.data.id) {
                      return err.data;
                    }
                    return r;
                  }),
              },
            },
          ],
        }),
      );
    } else {
      notification.error({
        message: 'Error',
        description: err.message,
      });
      yield put(
        routine.failure({
          ...payload,
          data: err,
        }),
      );
    }
  } finally {
    yield put(routine.fulfill(payload));
  }
}

function* rejectRewordingAsync(action) {
  yield call(checkEditFlow, action, rejectRewording, 'reject');
}

function* electRewordingAsync(action) {
  yield call(checkEditFlow, action, electRewording, 'elect');
}

function* removeBlockAsync(action) {
  // check auth status
  const currentUser = yield select(selectCurrentUser);
  if (!currentUser.uid) {
    Router.push({
      pathname: '/auth/login',
      query: {
        redirect: window.location.href,
        action: true,
      },
    });
    return;
  }
  const { payload } = action;
  yield put(removeBlock.request(payload));
  try {
    const preData = {
      paragraph_id: payload.blockId,
    };
    if (payload.rewordingId !== undefined) {
      preData.reword_id = payload.rewordingId;
    }
    yield call(removeContentRequest, payload.bundleId, payload.nodeId, preData);
    const { data: contentList } = yield call(getNodeContentIdsRequest, {
      node: payload.nodeId,
    });
    yield put(
      removeBlock.success({
        bundleId: payload.bundleId,
        nodeId: payload.nodeId,
        blockId: payload.blockId,
        structure: payload.structure,
        contentList,
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
  } finally {
    yield put(removeBlock.fulfill(payload));
  }
}

function* addMediaBlockFlow(action, routine) {
  const { payload } = action;
  const appendBlockInfo = {
    bundleId: payload.bundleId,
    nodeId: payload.nodeId,
    pivotId: payload.pivotId,
    type: 'upload',
    uploadType: 'image',
    file: payload.file,
  };
  if (!payload.retry) {
    yield put(createAppendBlock(appendBlockInfo));
  }
  try {
    const body = {
      html_content: '<figure><img src="{0}" /></figure>',
      file: payload.file,
    };
    if (payload.pivotId === BEGINNING_PIVOT) {
      body.is_first = true;
    } else {
      body.paragraph_id = payload.pivotId;
    }
    const { data } = yield call(
      insertMediaBlockRequest,
      payload.bundleId,
      payload.nodeId,
      body,
    );
    const [blockList, blocks] = mapArray(data);
    const { data: contentList } = yield call(getNodeContentIdsRequest, {
      node: payload.nodeId,
    });
    yield put(
      routine.success({
        ...payload,
        blockList,
        blocks,
        contentList,
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
    yield put(
      routine.failure({
        ...payload,
        err,
      }),
    );
  } finally {
    yield put(routine.fulfill(payload));
  }
}

function* submitMediaBlockAsync(action) {
  // check auth status
  const currentUser = yield select(selectCurrentUser);
  if (!currentUser.uid) {
    Router.push({
      pathname: '/auth/login',
      query: {
        redirect: window.location.href,
        action: true,
      },
    });
    return;
  }
  yield call(addMediaBlockFlow, action, submitMediaBlock, ACTION_SUBMIT_BLOCK);
}

function* commitMediaBlockAsync(action) {
  yield call(addMediaBlockFlow, action, commitMediaBlock, ACTION_COMMIT_BLOCK);
}

function* addMediaRewordingFlow(action, routine) {
  const { payload } = action;
  yield put(routine.request(payload));
  try {
    const { data } = yield call(
      submitMediaEditRequest,
      payload.bundleId,
      payload.nodeId,
      {
        reword_type: getRewordType(payload.structure),
        html_content: '<figure><img src="{0}" /></figure>',
        paragraph_id: payload.blockId,
        file: payload.file,
      },
    );
    const { data: contentList } = yield call(getNodeContentIdsRequest, {
      node: payload.nodeId,
    });
    const [blockList, blocks] = mapArray(data);
    yield put(
      routine.success({
        ...payload,
        blockList,
        blocks,
        contentList,
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
    yield put(
      routine.failure({
        ...payload,
        data: err,
      }),
    );
  } finally {
    yield put(routine.fulfill(payload));
  }
}

function* commitMediaRewordingAsync(action) {
  yield call(
    addMediaRewordingFlow,
    action,
    commitMediaRewording,
    ACTION_COMMIT_REWORDING,
  );
}

function* submitMediaRewordingAsync(action) {
  yield call(
    addMediaRewordingFlow,
    action,
    submitMediaRewording,
    ACTION_SUBMIT_REWORDING,
  );
}

function* updateMediaRewordingAsync(action) {
  yield call(
    addMediaRewordingFlow,
    action,
    updateMediaRewording,
    ACTION_UPDATE_REWORDING,
  );
}

function* updateBlockSortAsync(action) {
  const { payload } = action;
  const { bundleId, nodeId, blockId, originSort, pivotSort } = payload;
  try {
    const { data: updated } = yield call(updateBlockSortRequest, bundleId, {
      paragraph_id: blockId,
      new_sort: pivotSort > originSort ? pivotSort : pivotSort + 1,
    });
    yield put(
      updateBlockSort.success({
        bundleId,
        nodeId,
        data: updated,
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
  }
}

function* changeTemplateAsync(action) {
  yield delay(2000);
  const { payload } = action;
  const { bundleId, nodeId, template } = payload;
  const bundle = yield select((state) => selectBundleData(state, { bundleId }));
  const node = yield select((state) =>
    selectNodeBasic(state, { bundleId, nodeId }),
  );
  try {
    const template_config = {
      ...bundle.template_config,
      [node.type === NODE_TYPE_COVER
        ? 'cover_template'
        : 'chapter_template']: template,
    };
    const { data } = yield call(updateChapterRequest, bundleId, {
      node_id: nodeId,
      template_config,
    });
    yield put(
      changeTemplate.success({
        ...payload,
        data: {
          template_config: data.template_config,
        },
      }),
    );
  } catch (err) {
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    notification.error({
      message: 'Error',
      description: err.message,
    });
    yield put(
      changeTemplate.failure({
        ...payload,
        data: err,
      }),
    );
  } finally {
    yield put(changeTemplate.fulfill(payload));
  }
}

function* addCollaboratorAsync(action) {
  const {
    payload: { bundleId, nodeId, userId, role },
  } = action;
  try {
    const { data: newCollaborator } = yield call(
      addCollaboratorRequest,
      bundleId,
      {
        uid: userId,
        role,
        node: nodeId,
      },
    );
    yield call(
      handleCollaboratorPatch,
      receiveCollaboratorPatch({
        bundleId,
        nodeId,
        data: {
          method: ACTION_ADD_COLLABORATOR,
          payload: newCollaborator,
        },
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
    yield put(addCollaborator.failure({ bundleId, nodeId, data: err }));
  } finally {
    yield put(addCollaborator.fulfill({ bundleId, nodeId }));
  }
}

function* handleCollaboratorPatch(action) {
  const {
    payload: { bundleId, nodeId, data },
  } = action;
  const collaborators = yield select((state) =>
    selectNodeCollaborators(state, { bundleId, nodeId }),
  );
  const updatedAt = collaborators
    .map((c) => new Date(c.updated_at))
    .sort((a, b) => b - a)[0];
  if (new Date(data.updated_at) < updatedAt) {
    return;
  }
  let updatedCollaborators;
  switch (data.method) {
    case ACTION_ADD_COLLABORATOR:
      updatedCollaborators = uniqBy(
        [...collaborators, data.payload],
        (item) => item.id,
      );
      break;
    case ACTION_UPDATE_COLLABORATOR:
      updatedCollaborators = collaborators.map((c) => {
        if (c.id === data.payload.id) {
          return data.payload;
        }
        return c;
      });
      // if (data.payload.role === ROLE_ADMIN) {
      //   yield put(asyncFetchNodeEditInfo({
      //     bundleId,
      //     nodeId,
      //   }))
      // }
      break;
    case ACTION_REMOVE_COLLABORATOR:
      updatedCollaborators = collaborators.map((c) => {
        if (c.user_id === data.payload.userId) {
          return {
            ...c,
            is_deleted: true,
          };
        }
        return c;
      });
      break;
    default:
      logging.warn('Not Handled CollaboratorPatch', data);
  }
  if (updatedCollaborators) {
    yield put(
      patchCollaborators({
        bundleId,
        nodeId,
        collaborators: updatedCollaborators,
      }),
    );
  }
}

function* removeCollaboratorAsync(action) {
  const {
    payload: { bundleId, nodeId, userId },
  } = action;
  try {
    yield call(removeCollaboratorRequest, bundleId, {
      uid: userId,
      node_id: nodeId,
    });
    yield call(
      handleCollaboratorPatch,
      receiveCollaboratorPatch({
        bundleId,
        nodeId,
        data: {
          method: ACTION_REMOVE_COLLABORATOR,
          payload: {
            userId,
          },
        },
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
    yield put(removeCollaborator.failure({ bundleId, data: err }));
  } finally {
    yield put(removeCollaborator.fulfill({ bundleId }));
  }
}

function* updateCollaboratorSaga(action) {
  const {
    payload: {
      bundleId,
      nodeId,
      // collaboratorId,
      userId,
      role,
    },
  } = action;
  try {
    const { data: info } = yield call(updateCollaboratorRequest, bundleId, {
      uid: userId,
      role,
      node: nodeId,
    });

    yield call(
      handleCollaboratorPatch,
      receiveCollaboratorPatch({
        bundleId,
        nodeId,
        data: {
          method: ACTION_UPDATE_COLLABORATOR,
          payload: info,
        },
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
    yield put(
      updateCollaborator.failure({
        bundleId,
        nodeId,
        data: err,
      }),
    );
  } finally {
    yield put(
      updateCollaborator.fulfill({
        bundleId,
        nodeId,
      }),
    );
  }
}

function* changeEditPermissionAsync(action) {
  const {
    payload: { bundleId, nodeId, editPermission },
  } = action;
  yield put(changeEditPermission.request({ bundleId, nodeId }));
  try {
    const { data } = yield call(updateChapterRequest, bundleId, {
      node_id: nodeId,
      permission: editPermission,
    });
    yield put(
      changeEditPermission.success({
        bundleId,
        nodeId,
        editPermission: data.permission,
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
    yield put(
      changeEditPermission.failure({
        bundleId,
        nodeId,
        data: err,
      }),
    );
  } finally {
    yield put(changeEditPermission.fulfill({ bundleId, nodeId }));
  }
}

function* handleEditPatchSingal(action) {
  logging.info('handleEditPatchSingal', action.payload);

  const { method, structure, patch, nodeId } = action.payload;

  /**
   * 此处blocks 不使用 mutators 的方式进行数据更新，会影响到 blocks 初始化。
   * 在修改前，请注意检查 blocks reducer
   */
  const payload = {
    nodeId,
    structure,
  };
  if (
    method === 'insert-content' ||
    method === 'remove-content' ||
    method === 'reorder'
  ) {
    const { data: contentList } = yield call(getNodeContentIdsRequest, {
      node: nodeId,
    });
    payload.contentList = contentList;
  }
  if (method === 'insert-content' || method === 'submit-content') {
    const [, blocks] = mapArray(patch);
    payload.blocks = blocks;
  }

  yield put(patchNodeData(payload));
}

const patchCache = (nodeId, cacheKey, patch) => {
  const cache = getNodeCache(nodeId);
  if (!cache) {
    return;
  }
  const blockCache = cache.get(cacheKey) || {};
  cache.set(cacheKey, {
    ...blockCache,
    ...patch,
  });
};

function* initAppendEditCache(action) {
  const { payload } = action;
  if (payload.type === 'upload') {
    return;
  }
  const cacheKey = appendingBlockKey(payload);
  const { editorState, ...cacheInfo } = payload;
  const html = getHTML(editorState.getCurrentContent());
  cacheInfo.html = html;
  if (payload.pivotId === TAILING_PIVOT && !html) {
    removeAppendCache(action);
  } else {
    patchCache(payload.nodeId, cacheKey, cacheInfo);
  }
}

function* updateAppendCache(action) {
  const { payload } = action;
  const cacheKey = appendingBlockKey(payload);
  const html = payload.editorState.getCurrentContent().hasText()
    ? getHTML(payload.editorState.getCurrentContent())
    : '';
  if (payload.pivotId === TAILING_PIVOT && !html) {
    removeAppendCache(action);
  } else {
    patchCache(payload.nodeId, cacheKey, { html });
  }
}

function removeAppendCache(action) {
  const { payload } = action;
  const cache = getNodeCache(payload.nodeId);
  cache.remove(appendingBlockKey(payload));
}

function updateRewordingEditCache(action) {
  const { payload } = action;
  const cacheKey = rewordingKey(payload);
  const html = getHTML(payload.editorState.getCurrentContent());
  patchCache(payload.nodeId, cacheKey, {
    html,
  });
}

function initRewordingEditCache(action) {
  const { payload } = action;
  const cacheKey = rewordingKey(payload);
  const { editorState, ...cacheInfo } = payload;
  const html = getHTML(editorState.getCurrentContent());
  cacheInfo.html = html;
  patchCache(payload.nodeId, cacheKey, cacheInfo);
}

function removeRewordingEditCache(action) {
  const { payload } = action;
  const cacheKey = rewordingKey(payload);
  const cache = getNodeCache(payload.nodeId);
  cache.remove(cacheKey);
}

function initBlockEditCache(action) {
  const { payload } = action;
  if (payload.structure === 'cover') {
    return;
  }
  const cacheKey = blockKey(payload);
  const { editorState, ...cacheInfo } = payload;
  const html = editorState && getHTML(editorState.getCurrentContent());
  cacheInfo.html = html;
  patchCache(payload.nodeId, cacheKey, cacheInfo);
}

function updateBlockEditCache(action) {
  const { payload } = action;
  if (payload.structure === 'cover') {
    return;
  }
  const cacheKey = blockKey(payload);
  const html = getHTML(payload.editorState.getCurrentContent());
  patchCache(payload.nodeId, cacheKey, { html });
}

function cleanBlockEditCache(action) {
  const { payload } = action;
  const cacheKey = blockKey(payload);
  const cache = getNodeCache(payload.nodeId);
  cache.remove(cacheKey);
}

function removeEditCache(action) {
  const { payload } = action;
  const cache = getNodeCache(payload.nodeId);
  if (payload.cacheKey) {
    cache.remove(payload.cacheKey);
  } else if (payload.trigger === 'block') {
    cache.remove(blockKey(payload));
  } else if (payload.trigger === 'rewording') {
    cache.remove(rewordingKey(payload));
  }
}

export default function* nodeEditSaga() {
  // ---- broadcasing
  yield takeEvery(initNodeEdit, initNodeFlow);
  yield takeEvery(initNodeEdit.SUCCESS, joinNodeChannel);

  yield takeEvery(editPatchSignal, handleEditPatchSingal);

  yield takeEvery(likeSignal, handleLikeSignal);
  yield takeEvery(commentSignal, handleCommentSignal);
  // --- content operations
  yield takeEvery(commitBlock, commitBlockAsync);
  yield takeEvery(submitBlock, submitBlockAsync);
  yield takeEvery(commitMediaBlock, commitMediaBlockAsync);
  yield takeEvery(submitMediaBlock, submitMediaBlockAsync);
  yield takeEvery(removeBlock, removeBlockAsync);
  yield takeEvery(removeRewording, removeRewordingAsync);
  yield takeEvery(updateRewording, updateRewordingAsync);
  yield takeEvery(submitRewording, submitRewordingAsync);
  yield takeEvery(commitRewording, commitRewordingAsync);
  yield takeEvery(electRewording, electRewordingAsync);
  yield takeEvery(rejectRewording, rejectRewordingAsync);
  yield takeEvery(updateBlockSort, updateBlockSortAsync);

  yield takeEvery(updateMediaRewording, updateMediaRewordingAsync);
  yield takeEvery(commitMediaRewording, commitMediaRewordingAsync);
  yield takeEvery(submitMediaRewording, submitMediaRewordingAsync);

  yield takeEvery(
    initBlockEditWithTranslation,
    initBlockEditWithTranslationFlow,
  );

  // --- likes
  yield takeEvery(likeRewording, likeRewordingAsync);
  yield takeEvery(unlikeRewording, unlikeRewordingAsync);

  // -- config
  yield takeLatest(changeTemplate, changeTemplateAsync);
  yield takeEvery(changeEditPermission, changeEditPermissionAsync);

  // -- collaborator
  yield takeEvery(receiveCollaboratorPatch, handleCollaboratorPatch);
  yield takeEvery(addCollaborator, addCollaboratorAsync);
  yield takeEvery(removeCollaborator, removeCollaboratorAsync);
  yield takeEvery(updateCollaborator, updateCollaboratorSaga);

  // cache
  yield takeEvery(createAppendBlock, initAppendEditCache);
  yield takeEvery(updateAppendBlock, updateAppendCache);
  yield takeEvery(removeAppendBlock, removeAppendCache);

  yield takeEvery(initRewordingEdit, initRewordingEditCache);
  yield takeEvery(updateRewordingEditor, updateRewordingEditCache);
  yield takeEvery(exitRewordingEdit, removeRewordingEditCache);

  yield takeEvery(initBlockEdit, initBlockEditCache);
  yield takeEvery(updateBlockEditor, updateBlockEditCache);
  yield takeEvery(exitBlockEdit, cleanBlockEditCache);
  yield takeEvery(commitRewording.SUCCESS, removeEditCache);
  yield takeEvery(submitRewording.SUCCESS, removeEditCache);
  yield takeEvery(updateRewording.SUCCESS, removeEditCache);
  yield takeEvery(removeBlock.SUCCESS, removeEditCache);
}
