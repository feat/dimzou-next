import { createAction } from 'redux-actions';
import { createRoutine } from 'redux-saga-routines';
import { normalize } from 'normalizr';

import Router from 'next/router';
import ApiError from '@/errors/ApiError';
import notification from '@feat/feat-ui/lib/notification';
import { hasAuthedUser } from '@/modules/auth/selectors';
import { provider } from '@/components/FeedRender/helpers';
import {
  rewordingComment as rewordingCommentSchema,
  dimzouBundleDesc as dimzouBundleDescSchema,
  dimzouPublication as publicationSchema,
} from '../schema';

import {
  createOriginBundle as createOriginBundleRequest,
  createCopyBundle as createCopyBundleRequest,
  getParagraphRange as getParagraphRangeRequest,
  batchParagraph as batchParagraphRequest,
  insertContent as insertContentRequest,
  submitCover as submitCoverRequest,
  createNode as createNodeRequest,
  deleteNode as deleteNodeRequest,
  restoreNode as restoreNodeRequest,
  createBundleInvitation as createInvitationRequest,
  updateBundleConfig as updateBundleConfigRequest,
  createTranslationBundle as createTranslationBundleRequest,
  updateNodeVisibility as updateNodeVisibilityRequest,
  markRewordShared as markRewordSharedRequest,
  prePublish as prePublishRequest,
  publish as publishRequest,
  setApplyScenes as setApplyScenesRequest,
  separateNode as separateNodeRequest,
  sectionRelease as sectionReleaseRequest,
  fetchCollaborators as fetchCollaboratorsRequest,

  // comment
  createRewordingComment as createCommentRequest,
  updateRewordingComment as updateCommentRequest,
  deleteRewordingComment as deleteCommentRequest,
  // workspace
  fetchUserRelated as fetchUserRelatedRequest,
  mergeBundle as mergeBundleRequest,
  getBundleDesc as getBundleDescRequest,
  deleteBundle as deleteBundleRequest,

  // publication
  fetchBundlePublication as fetchBundlePublicationRequest,

  // dashboard
  fetchDimzouReports as fetchDimzouReportsRequest,
  fetchReaderReport as fetchReaderReportRequest,
  fetchReaderTaste as fetchReaderTasteRequest,
  fetchReaderCommented as fetchReaderCommentedRequest,
} from '../requests';

// import { selectBundleState } from '../selectors';
import { BUNDLE_STATUS_PUBLISHED } from '../constants';
import {
  selectNodePublication,
  selectPlainDimzouReports,
  selectPlainReaderTaste,
} from '../selectors';

import { getAsPath } from '../utils/router';

export * from './workshop';
export * from './dashboard';

export const setSidebarHasFocus = createAction('DZ/UI/SIDEBAR_HAS_FOCUS');

// --- Bundle
export const initBundle = createAction('DZ/BUNDLE/INIT');
export const fetchBundleEditInfo = createAction('DZ/BUNDLE/FETCH_EDIT_INFO');
export const loadBundleEditInfo = createAction('DZ/BUNDLE/LOAD_EDIT_INFO');
export const fetchBundleEditInfoFailure = createAction(
  'DZ/BUNDLE/FETCH_EDIT_INFO_FAILURE',
);
export const updateBundleDesc = createAction('DZ/BUNDLE/UPDATE_DESC');
export const updateNodeSort = createRoutine('DZ/BUNDLE/UPDATE_NODE_SORT');
export const patchNodes = createAction('DZ/BUNDLE/PATCH_NODES');
export const receiveBundleConfigPatch = createAction(
  'DZ/BUNDLE/RECEIVE_CONFIG_PATCH',
);
export const receiveNewNode = createAction('DZ/BUNDLE/CREATE_NEW_NODE');
export const receiveNodeDescInfo = createAction('DZ/BUNDLE/NODE_DESC_UPDATED');
export const resetBundle = createAction('DZ/BUNDLE/RESET');

export const deleteBundle = createRoutine('DZ/BUNDLE/DELETE');
export const createCopyBundle = createRoutine('DZ/BUNDLE/COPY');
export const setBundleCategory = createRoutine('DZ/BUNDLE/SET_CATEGORY');
export const setBundleLanguage = createRoutine('DZ/BUNDLE/SET_LANG');

export const asyncCreateCopyBundle = (payload) => async (dispatch) => {
  dispatch(createCopyBundle.request(payload));
  try {
    const { data } = await createCopyBundleRequest(payload.bundleId);
    dispatch(
      createCopyBundle.success({
        ...payload,
        data,
      }),
    );
    // TODO: trigger user workshop update.
    return data;
  } catch (err) {
    dispatch(createCopyBundle.failure(payload));
    throw err;
  } finally {
    dispatch(createCopyBundle.fulfill(payload));
  }
};

export const asyncSetBundleCategory = (payload) => async (dispatch) => {
  const { bundleId, category } = payload;
  try {
    await updateBundleConfigRequest(bundleId, {
      category: category.id,
    });
    dispatch(
      setBundleCategory.success({
        bundleId,
        category,
        entityMutators: [
          {
            [dimzouBundleDescSchema.key]: {
              [bundleId]: {
                category: {
                  $set: category.id,
                },
              },
            },
          },
        ],
      }),
    );
  } catch (err) {
    logging.error(err);
    throw err;
  }
};
export const asyncSetBundleLanguage = (payload) => async (dispatch) => {
  const { bundleId, language } = payload;
  try {
    await updateBundleConfigRequest(bundleId, {
      language,
    });
    dispatch(
      setBundleLanguage.success({
        bundleId,
        language,
        entityMutators: [
          {
            [dimzouBundleDescSchema.key]: {
              [bundleId]: {
                language: {
                  $set: language,
                },
              },
            },
          },
        ],
      }),
    );
  } catch (err) {
    logging.error(err);
    throw err;
  }
};

export const asyncDeleteBundle = (payload) => async (dispatch) => {
  const { bundleId } = payload;
  try {
    await deleteBundleRequest(bundleId);
    dispatch(deleteBundle.success(payload));
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
  }
};

// Node signal
export const editPatchSignal = createAction('DZ/NODE/EDIT_PATCH_SIGNAL');

// Node Admin
export const deleteNode = createRoutine('DZ/BUNDLE/DELETE_NODE');
export const restoreNode = createRoutine('DZ/BUNDLE/RESTORE_NODE');
export const updateNodeVisibility = createRoutine(
  'DZ/BUNDLE/UPDATE_NODE_VISIBILITY',
);
export const setLoadingProgress = createRoutine('DZ/NODE/SET_LOADING_PROGRESS');

// 分页加载段落数据；
export const fetchBlockRange = createRoutine('DZ/NODE/FETCH_BLOCK_RANGE');
export const asyncFetchBlockRange = (payload) => async (dispatch) => {
  const { bundleId, nodeId, blockId, forward, blockIndex, limit } = payload;
  const { data } = await getParagraphRangeRequest({
    node_id: nodeId,
    paragraph_id: blockId,
    limit,
    forward,
    sort: blockIndex, // contentBlockIndex start with 1 as a "insert block" exists.
  });
  if (!data.length) {
    return;
  }
  const blockList = [];
  const blocks = {};
  data.forEach((b) => {
    blockList.push(b.id);
    blocks[b.id] = b;
  });
  const chunkStartIndex = data[0].sort - 1;
  dispatch(
    loadBlockRange({
      bundleId,
      nodeId,
      structure: 'content',
      chunkStartIndex,
      blockList,
      blocks,
    }),
  );
};

export const asyncBatchParagraph = ({ ids }) => async (dispatch) => {
  const { data } = await batchParagraphRequest(ids);
  if (!data.length) return;

  Object.entries(
    data.reduce((acc, block) => {
      const acc_node = acc[block.node_id] || { blockList: [], blocks: {} };
      acc_node.blockList.push(block.id);
      acc_node.blocks[block.id] = block;
      return { [block.node_id]: acc_node, ...acc };
    }, {}),
  ).forEach(([nodeId, rest]) => dispatch(loadBlockRange({ nodeId, ...rest })));
};

export const asyncDeleteNode = (payload) => async (dispatch) => {
  const { bundleId, nodeId } = payload;
  // const isDeletingNode = selectIsDeteting(getState(), payload);
  // if (isDeletingNode) {
  //   return;
  // }
  dispatch(deleteNode.request(payload));
  try {
    const { data } = await deleteNodeRequest(bundleId, {
      node_id: nodeId,
    });
    logging.debug(data);
  } catch (err) {
    logging.debug(err);
  } finally {
    dispatch(deleteNode.fulfill(payload));
  }
};
export const asyncRestoreNode = (payload) => async (dispatch) => {
  const { bundleId, nodeId } = payload;
  dispatch(restoreNode.request(payload));
  try {
    const { data } = await restoreNodeRequest(bundleId, {
      node_id: nodeId,
    });
    logging.debug(data);
  } catch (err) {
    logging.debug(err);
  } finally {
    dispatch(restoreNode.fulfill(payload));
  }
};
export const asyncUpdateNodeVisibility = (payload) => async (dispatch) => {
  const { bundleId, nodeId, visibility } = payload;
  try {
    const { data } = await updateNodeVisibilityRequest(bundleId, {
      node_id: nodeId,
      visibility,
    });
    logging.debug(data);
  } catch (err) {
    logging.debug(err);
  } finally {
    dispatch(updateNodeVisibility.fulfill(payload));
  }
};

// --- Node
export const initNodeEdit = createRoutine('DZ/NODE/INIT_EDIT');
export const loadBlockRange = createAction('DZ/NODE/LOAD_BLOCK_RANGE');
// cover
export const updateAppendImagePivot = createAction(
  'DZ/NODE/CONTENT/APPEN_IMAGE_PIVOT',
);
export const addMediaBlock = createRoutine('DZ/NODE/ADD_MEDIA_BLOCK');
// like
export const likeSignal = createAction(`DZ/NODE/LIKE_SIGNAL`);
export const commentSignal = createAction(`DZ/NODE/COMMENT_SIGNAL`);

export const patchNodeData = createAction('DZ/NODE/PATCH_DATA');
export const updateRewordingCommentsCount = createAction(
  'DZ/NODE/UPDATE_REWORDING_COMMENTS_COUNT',
);
export const commitBlock = createRoutine(`DZ/NODE/COMMIT_BLOCK`);
export const submitBlock = createRoutine(`DZ/NODE/SUBMIT_BLOCK`);
export const commitMediaBlock = createRoutine(`DZ/NODE/COMMIT_MEDIA_BLOCK`);
export const submitMediaBlock = createRoutine(`DZ/NODE/SUBMIT_MEDIA_BLOCK`);
export const rejectBlock = createRoutine(`DZ/NODE/REJECT_BLOCK`);
export const electBlock = createRoutine(`DZ/NODE/ELECT_BLOCK`);
export const removeBlock = createRoutine(`DZ/NODE/REMOVE_BLOCK`);
export const commitRewording = createRoutine(`DZ/NODE/COMMIT_REWORDING`);
export const submitRewording = createRoutine(`DZ/NODE/SUBMIT_REWORDING`);
export const removeRewording = createRoutine(`DZ/NODE/REMOVE_REWORDING`);
export const commitMediaRewording = createRoutine(
  `DZ/NODE/COMMIT_MEDIA_REWORDING`,
);
export const submitMediaRewording = createRoutine(
  `DZ/NODE/SUBMIT_MEDIA_REWORDING`,
);
export const updateMediaRewording = createRoutine(
  `DZ/NODE/UPDATE_MEDIA_REWORDING`,
);

export const updateRewording = createRoutine(`DZ/NODE/UPDATE_REWORDING`);
export const electRewording = createRoutine(`DZ/NODE/ELECT_REWORDING`);
export const rejectRewording = createRoutine(`DZ/NODE/REJECT_REWORDING`);

export const setActiveEditorKey = createAction(`DZ/NODE/SET_ACTIVE_EDITOR_KEY`);
export const updateBlockSort = createRoutine(`DZ/NODE/UPDATE_BLOCK_SORT`);
export const changeEditPermission = createRoutine(
  `DZ/NODE/CHANGE_EDIT_PERMISSION`,
);
export const changeTemplate = createRoutine(`DZ/NODE/CHANGE_TEMPLATE`);

// -- Collaborators
export const patchCollaborators = createAction(`DZ/COLLABORATOR/PATCH`);
export const addCollaborator = createRoutine(`DZ/COLLABORATOR/ADD`);
export const updateCollaborator = createRoutine(`DZ/COLLABORATOR/UPDATE`);
export const removeCollaborator = createRoutine(`DZ/COLLABORATOR/REMOVE`);
export const receiveCollaboratorPatch = createRoutine(
  `DZ/COLLABORATOR/RECEIVE_PATCH`,
);
export const fetchCollaborators = createRoutine('DZ/COLLABORATOR/FETCH_LIST');
export const asyncFetchCollaborators = (payload) => async (dispatch) => {
  dispatch(fetchCollaborators.trigger(payload));
  try {
    const { data } = await fetchCollaboratorsRequest({
      node: payload.nodeId,
    });
    dispatch(
      fetchCollaborators.success({
        ...payload,
        data,
      }),
    );
  } catch (err) {
    dispatch(
      fetchCollaborators.failure({
        ...payload,
        data: err,
      }),
    );
  } finally {
    dispatch(fetchCollaborators.fulfill(payload));
  }
};

// --- Invitation
export const openInvitation = createAction('DZ/WORKSPACE/OPEN_INVITATION');
export const closeInvitation = createAction('DZ/WORKSPACE/CLOSE_INVITATION');
export const createInvitation = createRoutine('DZ/WORKSPACE/CREATE_INVITATION');
export const asyncCreateInvitation = (payload) => async (dispatch) => {
  const { bundleId, nodeId } = payload;
  dispatch(createInvitation.request(payload));
  try {
    const { data: invitation } = await createInvitationRequest(bundleId, {
      node_id: nodeId,
    });
    dispatch(
      createInvitation.success({
        bundleId,
        nodeId,
        data: invitation,
      }),
    );
  } catch (err) {
    dispatch(
      createInvitation.failure({
        bundleId,
        nodeId,
        data: err,
      }),
    );
  } finally {
    dispatch(
      createInvitation.fulfill({
        bundleId,
        nodeId,
      }),
    );
  }
};

export const markRewordShared = createRoutine('DZ/BUNDLE/MARK_REWORD_SHARED');
export const asyncMarkRewordShared = (payload) => async (dispatch) => {
  const { bundleId, rewordingId } = payload;
  try {
    await markRewordSharedRequest(bundleId, {
      reword_id: rewordingId,
    });
    dispatch(markRewordShared.success(payload));
  } catch (err) {
    logging.debug(err);
  }
};

// --- Like
export const initLikeWidget = createAction(`DZ/REWORDING/INIT_LIKE_WIDGET`);
export const likeRewording = createRoutine(`DZ/REWORDING/LIKE_REWORDING`);
export const unlikeRewording = createRoutine(`DZ/REWORDING/UNLIKE_REWORDING`);
export const updateRewordingLikesCount = createAction(
  `DZ/REWORDING/UPDATE_REWORDING_LIKES_COUNT`,
);

// --- Comment
export const fetchRewordingCommentTree = createRoutine(
  `DZ/COMMENT/GET_COMMENT_TREE`,
);
export const getRewordingComment = createRoutine(
  `DZ/COMMENT/GET_REWORDING_COMMENT`,
);
export const createRewordingComment = createRoutine(
  `DZ/COMMENT/CREATE_REWORDING_COMMENT`,
);
export const updateRewordingComment = createRoutine(
  `DZ/COMMENT/UPDATE_REWORDING_COMMENT`,
);
export const deleteRewordingComment = createRoutine(
  `DZ/COMMENT/DELETE_REWORDING_COMMENT`,
);
export const registerRewordingCommentBundle = createAction(
  `DZ/COMMENT/REGISTER_REWORDING_COMMENT_BUNDLE`,
);
export const initRewordingCommentBundle = createRoutine(
  `DZ/COMMENT/INIT_REWORDING_COMMENT_BUNDLE`,
);
export const receiveRewordingComment = createAction(
  `DZ/COMMENT/RECEIVE_REWORDING_COMMENT`,
);
export const removeRewordingComment = createAction(
  `DZ/COMMENT/REMOVE_REWORDING_COMMENT`,
);
export const receiveUpdatedRewordingComment = createAction(
  `DZ/COMMENT/RECEIVE_UPDATED_REWORDING_COMMENT`,
);
export const increaseRootCount = createAction(`DZ/COMMENT/INCREASE_ROOT_COUNT`);
export const decreaseRootCount = createAction(`DZ/COMMENT/DECREASE_ROOT_COUNT`);

export const asyncCreateRewordingComment = (payload) => async (
  dispatch,
  getState,
) => {
  const hasAuthed = hasAuthedUser(getState());
  if (!hasAuthed) {
    Router.push({
      pathname: '/auth/login',
      query: {
        redirect: window.location.pathname,
        action: true,
      },
    });
    return undefined;
  }
  const { nodeId, rewordingId, parentId, content } = payload;
  try {
    const { data: comment } = await createCommentRequest({
      node_id: nodeId,
      rewording_id: rewordingId,
      parent_id: parentId,
      content,
    });
    const normalized = normalize(comment, rewordingCommentSchema);
    const data = {
      bundleId: payload.bundleId,
      nodeId: payload.nodeId,
      structure: payload.structure,
      blockId: payload.blockId,
      parentId,
      rewordingId,
      commentId: normalized.result,
      bundleEntities: normalized.entities,
    };
    dispatch(createRewordingComment.success(data));
    return data;
  } catch (err) {
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    dispatch(
      createRewordingComment.failure({
        rewordingId: payload.rewordingId,
        parentId: payload.parentId,
        error: err,
      }),
    );
    throw err;
  }
};

export const asyncUpdateRewordingComment = (payload) => async (dispatch) => {
  const { nodeId, rewordingId, id, content } = payload;
  try {
    const { data: comment } = await updateCommentRequest({
      node_id: nodeId,
      rewording_id: rewordingId,
      id,
      content,
    });

    const normalized = normalize(comment, rewordingCommentSchema);
    dispatch(
      updateRewordingComment.success({
        rewordingId,
        commentId: normalized.id,
        bundleEntities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(
      updateRewordingComment.failure({
        rewordingId,
        error: err,
      }),
    );
    throw err;
  }
};

export const asyncDeleteRewordingComment = (payload) => async (dispatch) => {
  try {
    await deleteCommentRequest({
      node_id: payload.nodeId,
      id: payload.id,
    });

    const info = {
      commentId: payload.id,
      rewordingId: payload.rewordingId,
      parentId: payload.parentId,
    };

    dispatch(deleteRewordingComment.success(info));
  } catch (err) {
    dispatch(
      deleteRewordingComment.failure({
        rewordingId: payload.rewordingId,
        error: err,
      }),
    );
  }
};

// --- Appending block
export const initAppendBlock = createAction(`DZ/APPENDING/INIT_APPEND_BLOCK`);
export const createAppendBlock = createAction(
  `DZ/APPENDING/CREATE_APPEND_BLOCK`,
);
export const updateAppendBlock = createAction(
  `DZ/APPENDING/UPDATE_APPEND_BLOCK`,
);
export const postAppendBlock = createAction(`DZ/APPENDING/POST_APPEND_BLOCK`);
export const removeAppendBlock = createAction(
  `DZ/APPENDING/REMOVE_APPEND_BLOCK`,
);

// --- Block
export const registerBlock = createAction(`DZ/BLOCK/REGISTER`);
export const initBlockEdit = createAction(`DZ/BLOCK/INIT_EDIT`);
export const exitBlockEdit = createAction(`DZ/BLOCK/EXIT_EIDT`);
export const initBlockEditWithTranslation = createAction(
  `DZ/BLOCK/INIT_EDIT_WITH_TRANSLATION`,
);
export const getBlockTranslation = createRoutine(`DZ/BLOCK/GET_TRANSLATION`);
export const toggleBlockExpanded = createAction(`DZ/BLOCK/TOGGLE_EXPANDED`);
export const updateBlockEditor = createAction(`DZ/BLOCK/UPDATE_EDITOR`);
export const updateBlockState = createAction(`DZ/BLOCK/UPDATE_BLOCK_STATE`);

// --- Rewording
export const openCommentPanel = createAction(
  'DIMZOU_REWORDING/OPEN_COMMENT_PANEL',
);
export const closeCommentPanel = createAction(
  'DIMZOU_REWORDING/CLOSE_COMMENT_PANEL',
);
export const initRewordingEdit = createAction(
  `DZ/REWORDING/INIT_REWORDING_EDIT`,
);
export const exitRewordingEdit = createAction(
  `DZ/REWORDING/EXIT_REWORDING_EDIT`,
);
export const updateRewordingEditor = createAction(
  `DZ/REWORDING/UPDATE_REWORDING_EDITOR`,
);

// -- User Drafts (Workspace Explore)
export const fetchUserDrafts = createRoutine('DZ/WORKSPACE/FETCH_USER_DRAFTS');
export const createBundle = createRoutine(`DZ/WORKSPACE/CREATE_BUNDLE`);
export const createNode = createRoutine(`DZ/WORKSPACE/CREATE_NODE`);
export const bundleUpdateSingal = createRoutine(
  `DZ/WORKSPACE/BUNDLE_UPDATE_SIGNAL`,
);
export const mergeBundle = createRoutine('DZ/WORKSPACE/MERGE_BUNDLE');
export const mergeBundlePatch = createAction('DZ/WORKSPACE/MERGE_BUNDLE_PATCH');
export const separateChapterPatch = createAction(
  'DZ/WORKSPACE/SEPARATE_CHAPTER_PATCH',
);
export const newBundlePatch = createAction('DZ/WORKSPACE/NEW_BUNDLE_PATCH');
// export const fetchUserCreated = createRoutine('DZ/WORKSPACE/FETCH_USER_CREATED');
export const fetchUserRelated = createRoutine(
  'DZ/WORKSPACE/FETCH_USER_RELATED',
);

export const initRelease = createAction(`DZ/WORKSPACE/INIT_RELEASE`);
export const exitRelease = createAction(`DZ/WORKSPACE/EXIT_RELEASE`);
export const setReleaseStep = createAction(`DZ/WORKSPACE/SET_RELEASE_STEP`);
export const setReleaseData = createAction(`DZ/WORKSPACE/SET_RELEASE_DATA`);

export const showCurrentUserDrafts = createAction(
  `DZ/WORKSPACE/SHOW_CURRENT_USER_DRAFTS`,
);

export const asyncFetchUserRelated = (payload) => async (dispatch) => {
  dispatch(fetchUserRelated.trigger(payload));
  try {
    dispatch(fetchUserRelated.request(payload));
    const { data, pagination } = await fetchUserRelatedRequest({
      uid: payload.userId,
      page_size: payload.pageSize,
      ...(payload.next || {}),
    });
    const normalized = normalize(data, [dimzouBundleDescSchema]);
    dispatch(
      fetchUserRelated.success({
        userId: payload.userId,
        raw: data,
        data: normalized.result,
        entities: normalized.entities,
        next: pagination.next
          ? {
              page: pagination.next,
              page_size: pagination.page_size,
            }
          : null,
      }),
    );
  } catch (err) {
    dispatch(
      fetchUserRelated.failure({
        userId: payload.userId,
        data: err,
      }),
    );
  } finally {
    dispatch(fetchUserRelated.fulfill(payload));
  }
};

export const asyncMergeBundle = (payload) => async (dispatch) => {
  dispatch(mergeBundle.trigger());
  try {
    dispatch(mergeBundle.trigger());
    await mergeBundleRequest(payload.bundleId, {
      merged_bundle_id: payload.sourceBundleId,
    });

    const { data } = await getBundleDescRequest(payload.bundleId);
    const normalized = normalize(data, dimzouBundleDescSchema);
    dispatch(
      updateBundleDesc({
        entities: normalized.entities,
      }),
    );
    // reset nodeState
    // const bundleState = selectBundleState(getState(), { bundleId: payload.sourceBundleId });
    // const nodeId = get(bundleState, 'data.nodes.0.id');
    // if (nodeId) {
    //   dispatch(resetBundle({
    //     bundleId: payload.sourceBundleId,
    //     nodeId,
    //   }))
    // }

    // redirect, TODO: new node id required.
    // if (Router.query.bundleId === String(payload.sourceBundleId)) {
    //   Router.replace({
    //     pathname: '/dimzou-edit',
    //     query: {
    //       nodeId: Router.query.nodeId,
    //       bundleId: payload.bundleId,
    //     },
    //   }, `/draft/${payload.bundleId}/${Router.query.nodeId}`)
    // }
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    dispatch(
      mergeBundle.failure({
        data: err,
      }),
    );
  } finally {
    dispatch(mergeBundle.fulfill());
  }
};

export const separateNode = createRoutine('DZ/WORKPACE/SEPARATE_NODE');
export const asyncSeparateNode = (payload) => async (dispatch) => {
  try {
    const { data } = await separateNodeRequest(payload.bundleId, {
      node_id: payload.nodeId,
    });

    const { data: updated } = await getBundleDescRequest(payload.bundleId);
    const normalized = normalize(updated, dimzouBundleDescSchema);
    dispatch(
      updateBundleDesc({
        entities: normalized.entities,
      }),
    );

    // dispatch(separateNode.success({
    //   bundleId: payload.bundleId,
    //   nodeId: payload.nodeId,
    //   data,
    // }))
    if (
      Router.query.bundleId === String(payload.bundleId) &&
      Router.query.nodeId === String(payload.nodeId)
    ) {
      await dispatch(
        initBundle({
          bundleId: data.id,
          nodeId: Router.query.nodeId,
        }),
      );
      const href = {
        pathname: '/dimzou-edit',
        query: {
          pageName: 'draft',
          bundleId: data.id,
          nodeId: Router.query.nodeId,
        },
      };
      Router.replace(href, getAsPath(href));
    }
    // dispatch(asyncFetchUserDrafts());
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
  }
};

export const asyncCreateBundle = (payload) => async (dispatch) => {
  dispatch(createBundle.trigger(payload));
  try {
    const params = {
      html_title: payload.htmlTitle,
      title_meta: payload.title,
      html_summary: payload.htmlSummary,
      summary_meta: payload.summary,
      is_multi_chapter: payload.isMultiChapter,
      template: payload.template,
    };
    const { data } = await createOriginBundleRequest(params);
    if (payload.textContent) {
      await insertContentRequest(data.id, data.node_id, {
        content: payload.textContent,
        html_content: payload.htmlContent,
        content_meta: payload.content,
      });
    }
    if (data.cover) {
      const template = 'I';
      await submitCoverRequest(data.id, data.node_id, {
        img: data.cover.sourceImage,
        crop_img: data.cover.croppedImage,
        template_config: {
          [template]: {
            cropData: data.cover.data,
          },
        },
      });
    }
    // TODO: trigger user workshop update.
    const href = {
      pathname: '/dimzou-edit',
      query: {
        pageName: 'draft',
        bundleId: data.id,
        nodeId: data.node_id,
      },
    };
    Router.replace(href, getAsPath(href));
  } catch (err) {
    logging.debug(err);
  }
};

export const asyncCreateNode = (payload) => async (dispatch) => {
  const { bundleId, data } = payload;
  dispatch(createNode.trigger(payload));

  const body = {
    title_meta: data.title,
    html_title: data.htmlTitle,
    summary_meta: data.summary,
    html_summary: data.htmlSummary,
    template_config: {
      chapter_template: data.template,
    },
    permission: data.permission,
  };

  try {
    dispatch(createNode.request({ bundleId }));
    const { data: node } = await createNodeRequest(bundleId, body);

    if (data.textContent) {
      await insertContentRequest(bundleId, node.id, {
        content: data.textContent,
        html_content: data.htmlContent,
        content_meta: data.content,
      });
    }
    if (data.cover) {
      await submitCoverRequest(bundleId, node.id, {
        img: data.cover.sourceImage,
        crop_img: data.cover.croppedImage,
        template_config: {
          [data.template]: {
            cropData: data.cover.data,
          },
        },
      });
    }

    const nodes = [node];

    // TODO: trigger user workshop update.

    dispatch(
      createNode.success({
        bundleId,
        nodeId: node.id,
        nodeSort: node.sort,
        isCover: data.isCover,
        data: nodes,
      }),
    );
    const href = {
      pathname: '/dimzou-edit',
      query: {
        pageName: 'draft',
        bundleId,
        nodeId: node.id,
      },
    };
    Router.push(href, getAsPath(href));
  } catch (err) {
    dispatch(createNode.failure({ bundleId, data: err }));
    throw err;
  } finally {
    dispatch(createNode.fulfill({ bundleId }));
  }
};

export const setApplyScenes = createRoutine('DZ/BUNDLE/SET_APPLY_SCENES');
export const release = createRoutine('DZ/BUNDLE/RELEASE');
export const preRelease = createRoutine('DZ/BUNDLE/PRE_PUBLISH');
export const asyncSetApplyScenes = (payload) => async (dispatch) => {
  const { data } = await setApplyScenesRequest(payload.bundleId, payload.data);
  dispatch(
    setApplyScenes.success({
      bundleId: payload.bundleId,
      data: data.apply_scenes,
      entityMutators: [
        {
          [dimzouBundleDescSchema.key]: {
            [payload.bundleId]: {
              apply_scenes: { $set: data.apply_scenes },
            },
          },
        },
      ],
    }),
  );
};

export const asyncRelease = (payload) => async (dispatch) => {
  const { bundleId, data } = payload;
  const body = {
    nodes: data.nodes,
  };
  if (data.category) {
    body.category_id = data.category.id;
  }
  if (data.cards) {
    body.extra_info_cards = data.cards;
  }
  try {
    dispatch(release.request({ bundleId }));
    const { data: result } = await publishRequest(bundleId, body);
    // TO_ENHANCE: may need to fetch bundle desc;
    dispatch(
      release.success({
        ...payload,
        entityMutators: [
          {
            [dimzouBundleDescSchema.key]: {
              [bundleId]: {
                status: {
                  $set: BUNDLE_STATUS_PUBLISHED,
                },
              },
            },
          },
        ],
      }),
    );
    return result;
  } finally {
    dispatch(
      release.fulfill({
        bundleId,
      }),
    );
  }
};

export const asyncPreRelease = (payload) => async (dispatch) => {
  await prePublishRequest(payload.bundleId, {
    nodes: payload.data,
  });
  dispatch(preRelease.success(payload));
};

export const fetchBundleDesc = createRoutine(`DZ/PUBLICATION/BUNDLE_DESC`);
export const asyncFetchBundleDesc = (payload) => async (dispatch) => {
  try {
    dispatch(fetchBundleDesc.request(payload));
    const { data } = await getBundleDescRequest(payload.bundleId);
    const normalized = normalize(data, dimzouBundleDescSchema);
    dispatch(
      fetchBundleDesc.success({
        bundleId: data.id,
        userId: data.user_id,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(
      fetchBundleDesc.failure({
        bundleId: payload.bundleId,
        data: err,
      }),
    );
  } finally {
    dispatch(fetchBundleDesc.fulfill(payload));
  }
};

// Publication
export const fetchBundlePublication = createRoutine(
  `DZ/PUBLICATION/FETCH_OF_BUNDLE`,
);

// TO_ENHANCE: update publication data handling
export const asyncFetchBundlePublication = (payload) => async (dispatch) => {
  dispatch(fetchBundlePublication.trigger(payload));
  try {
    dispatch(fetchBundlePublication.request(payload));
    // TODO: update node map
    const { data } = await fetchBundlePublicationRequest({
      bundle: payload.bundleId,
      node: payload.nodeId,
      related: false,
    });
    const { nodes, related, ...rest } = data;
    const normalized = normalize(rest, publicationSchema);
    dispatch(
      fetchBundlePublication.success({
        bundleId: payload.bundleId,
        nodeId: payload.nodeId,
        publicationId: normalized.result,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(
      fetchBundlePublication.failure({
        bundleId: payload.bundleId,
        nodeId: payload.nodeId,
        data: err,
      }),
    );
  } finally {
    dispatch(fetchBundlePublication.fulfill(payload));
  }
};

export const tryToFetchPublication = (payload) => async (
  dispatch,
  getState,
) => {
  const nodeState = selectNodePublication(getState(), payload);
  if (!nodeState || (!nodeState.data && !nodeState.isFetching)) {
    dispatch(asyncFetchBundlePublication(payload));
  }
};

// dashboard related
export const fetchDimzouReports = createRoutine('DZ/DASH/GET_DIMZOU_REPORTS');
export const fetchReaderReport = createRoutine('DZ/DASH/READER_REPORT');
export const fetchReaderTaste = createRoutine('DZ/DASH/FETCH_READER_TASTE');
export const fetchReaderCommented = createRoutine(
  'DZ/DASH/FETCH_READER_COMMENTED',
);

export const asyncFetchDimzouReportsList = (payload) => async (
  dispatch,
  getState,
) => {
  const subState = selectPlainDimzouReports(getState());
  if (!subState.loading) {
    dispatch(fetchDimzouReports.trigger(payload));
    try {
      dispatch(fetchDimzouReports.request(payload));
      const { data, pagination } = await fetchDimzouReportsRequest(
        subState.next || { page_size: 6 },
      );
      const normalized = normalize(data, [dimzouBundleDescSchema]);
      dispatch(
        fetchDimzouReports.success({
          list: normalized.result,
          next: pagination.next
            ? {
                page: pagination.next,
                page_size: pagination.page_size,
              }
            : null,
          hasMore: !!pagination.next,
          entities: normalized.entities,
        }),
      );
    } catch (err) {
      dispatch(fetchDimzouReports.failure(err));
      throw err;
    } finally {
      dispatch(fetchDimzouReports.fulfill());
    }
  }
};

export const asyncFetchReaderReport = () => async (dispatch) => {
  dispatch(fetchReaderReport.trigger());
  try {
    dispatch(fetchReaderReport.request());
    const { data } = await fetchReaderReportRequest();
    dispatch(fetchReaderReport.success(data));
  } catch (err) {
    dispatch(fetchReaderReport.failure(err));
    throw err;
  } finally {
    dispatch(fetchReaderReport.fulfill());
  }
};

export const asyncFetchReaderTasteList = (payload) => async (
  dispatch,
  getState,
) => {
  const subState = selectPlainReaderTaste(getState());
  if (subState.loading) {
    return;
  }
  dispatch(fetchReaderTaste.trigger());
  try {
    dispatch(fetchReaderTaste.request(payload));
    const params = subState.next || { page_size: 6, page: 1 };
    const { data, pagination } = await fetchReaderTasteRequest(params);
    const normalized = normalize(data, [dimzouBundleDescSchema]);

    const templates = provider.getTemplates(data.length, subState.templates);

    dispatch(
      fetchReaderTaste.success({
        list: normalized.result,
        next: pagination.next
          ? {
              ...params,
              page: pagination.next,
            }
          : null,
        hasMore: !!pagination.next,
        entities: normalized.entities,
        templates,
      }),
    );
  } catch (err) {
    dispatch(fetchReaderTaste.failure(err));
    throw err;
  } finally {
    dispatch(fetchReaderTaste.fulfill());
  }
};

export const asyncFetchReaderCommented = () => async (dispatch) => {
  dispatch(fetchReaderCommented.trigger());
  try {
    dispatch(fetchReaderCommented.request());
    const { data } = await fetchReaderCommentedRequest();
    dispatch(fetchReaderCommented.success({ data }));
  } catch (err) {
    dispatch(fetchReaderCommented.failure(err));
    throw err;
  } finally {
    dispatch(fetchReaderCommented.fulfill());
  }
};

export const createTranslation = createRoutine('DZ/BUNDLE/CREATE_TRANSLATION');
export const asyncCreateTranslation = (payload) => async (dispatch) => {
  dispatch(createTranslation.trigger());
  try {
    dispatch(createTranslation.request());
    const { data } = await createTranslationBundleRequest({
      source_type: 'dimzou_bundle',
      bundle_id: payload.bundleId,
      node_id: payload.nodeId,
      language: payload.language,
    });
    dispatch(createTranslation.success({ data }));
    return data;
  } catch (err) {
    dispatch(createTranslation.failure(err));
    throw err;
  } finally {
    dispatch(createTranslation.fulfill());
  }
};

export const initSectionRelease = createAction(
  'DZ/BUNDLE/INIT_SECTION_RELEASE',
);
export const exitSectionRelease = createAction(
  'DZ/BUNDLE/EXIT_SECTION_RELEASE',
);
export const setSectionReleaseData = createAction(
  'DZ/BUNDLE/UPDATE_SECTION_RELEASE',
);
export const sectionRelease = createRoutine('DZ/BUNDLE/SECTION_RELEASE');
export const asyncSectionRelease = (payload) => async (dispatch) => {
  dispatch(sectionRelease.trigger(payload));
  try {
    const { data } = await sectionReleaseRequest(payload.bundleId, {
      title_paragraph_id: payload.titleId,
      title: payload.title,
      summary: payload.summary,
      category_id: payload.category.id,
      cover: payload.cover,
      extra_info_cards: JSON.stringify(payload.cards),
    });
    dispatch(
      sectionRelease.success({
        bundleId: payload.bundleId,
        nodeId: payload.nodeId,
        titleId: payload.titleId,
      }),
    );
    // TO_ENHANCE: 此处应该有更新 workshop 的动作。或者等待消息提示！！
    return data;
  } catch (err) {
    dispatch(
      sectionRelease.failure({
        bundleId: payload.bundleId,
        nodeId: payload.nodeId,
        titleId: payload.titleId,
        data: err,
      }),
    );
    throw err;
  } finally {
    dispatch(sectionRelease.fulfill(payload));
  }
};
