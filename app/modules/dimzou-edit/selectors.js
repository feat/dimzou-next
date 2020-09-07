import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import get from 'lodash/get';

import { 
  rewordingComment as rewordingCommentSchema,
  dimzouBundleDesc as dimzouBundleDescSchema,
  dimzouPublication as publicationSchema,
} from '@/schema';
import { selectEntities } from '@/modules/entity/selectors';

import { selectCurrentUser } from '@/modules/auth/selectors';
import { isAdmin, isOwner, getUserRole } from './utils/collaborators';
import { BLOCK_KEY_SEPARATOR } from './constants';

const REDUCER_KEY ='dimzou-edit';
const getAppendingKey = ({ nodeId }) => nodeId;

export const selectWorkspaceState = (state) => get(state, [REDUCER_KEY, 'workspace']);

export const selectBundleState = createSelector(
  (state, props) => get(state, [
    REDUCER_KEY,
    'dimzouBundles',
    props.bundleId,
  ]),
  selectEntities,
  (bundleState, entities) => {
    if (!bundleState) {
      return bundleState;
    }
    if (bundleState.data) {
      const data = denormalize(bundleState.data, dimzouBundleDescSchema, entities);
      return {
        ...bundleState,
        data,
      }
    }
    return bundleState;
  }
)
  
export const selectNodeState = (state, props) =>
  get(state, [
    REDUCER_KEY,
    'dimzouNodes',
    props.nodeId,
  ]);

export const selectBundleData = (state, props) => {
  const bundleState = selectBundleState(state, props);
  return bundleState ? bundleState.data : undefined;
};

export const selectNodeData = (state, props) => {
  const nodeState = selectNodeState(state, props);
  return nodeState ? nodeState.data : undefined;
};

export const selectNodeCollaborators = (state, props) => {
  const node = selectNodeData(state, props);
  return node ? node.collaborators : [];
};

export const selectNodeEditPermission = (state, props) => {
  const node = selectNodeData(state, props);
  return node ? node.permission : undefined;
};

export const selectBundleEditMode = (state, props) => {
  const bundleState = selectBundleState(state, props);
  return bundleState && bundleState.mode;
};

export const selectBundleFeatures = (state, props) => {
  const bundleState = selectBundleState(state, props);
  return bundleState && bundleState.features;
};

export const selectBundleUserCapabilities = createSelector(
  selectNodeCollaborators,
  selectNodeEditPermission,
  selectBundleFeatures,
  selectCurrentUser,
  (collaborators, editPermission, features, currentUser) => {
    if (!features) {
      return {};
    }
    const userIsAdmin = isAdmin(currentUser, collaborators, editPermission);
    const userIsOwner = isOwner(currentUser, collaborators, editPermission);
    const userRole = getUserRole(currentUser, collaborators, editPermission);

    return {
      isAdmin: userIsAdmin,
      isOwner: userIsOwner,
      role: userRole,
      canChangeEditPermission: userIsOwner,
      canAssignAdmin: userIsOwner,
      canInviteCollaborator: userRole !== null,
      canElect: userIsOwner || userIsAdmin,
      canCreateChapter: features.canCreateChapter && userIsOwner,
      canChangeTemplate: features.canChangeTemplate && userIsOwner,
      canPublish: userIsOwner,
    };
  },
);

export const selectNodeUserRewordingLikes = createSelector(
  selectNodeData,
  (node) => {
    const map = {};
    if (node && node.user_rewording_likes) {
      node.user_rewording_likes.forEach((item) => {
        if (!item.deleted_at) {
          map[item.rewording_id] = true;
        }
      });
    }
    return map;
  },
);

export const selectRewordingState = (state, props) =>
  get(
    state,
    [REDUCER_KEY, 'rewordings', props.rewordingId],
  );

export const selectAppendingState = (state, props) => {
  const key = getAppendingKey(props);
  return get(state, [REDUCER_KEY, 'appendings', key, String(props.pivotId)]);
};

export const selectLikeWidgetState = (state, { rewordingId }) =>
  get(state, [REDUCER_KEY, 'likes', String(rewordingId)], {});

export const selectActiveCompoState = (state, props) => {
  const { activeCompoKey } = props;
  if (!activeCompoKey) {
    return null;
  }
  return get(state, [REDUCER_KEY, ...activeCompoKey.split('.')], null);
};

export const selectRewordingCommentBundle = (state, props) =>
  get(state, [REDUCER_KEY, 'rewordingComments', String(props.rewordingId)]);

export const selectBlockState = (state, props) => {
  const blockKey = `${props.structure}${BLOCK_KEY_SEPARATOR}${props.blockId}`;
  return get(state, [REDUCER_KEY, 'dimzouBlocks', blockKey]);
};

export const makeSelectRewordingCommentBundle = () =>
  createSelector(selectRewordingCommentBundle, (subState) => {
    if (!subState) {
      return undefined;
    }
    const { entities, ...bundleState } = subState;
    const denormalized = denormalize(
      bundleState,
      { comments: [rewordingCommentSchema] },
      entities,
    );
    return denormalized;
  });

export const selectRewordingCommentsCount = (state, props) => {
  const bundleState = selectRewordingCommentBundle(state, props);
  if (bundleState) {
    return bundleState.rootCount;
  }
  return undefined;
};

export const selectRewordingCommentsUserCount = createSelector(
  selectRewordingCommentBundle,
  (_, props) => props.currentUser.uid,
  (bundleState, userId) => {
    if (!bundleState) {
      return undefined;
    }
    const comments = bundleState.entities[rewordingCommentSchema.key];
    return comments ? Object.values(comments).filter((comment) => (
      comment &&
      !comment.parent_id && 
      String(comment.user) === String(userId)
    )).length : 0;
  }
)

export const commentHasLoaded = (state, props) => {
  const bundleState = selectRewordingCommentBundle(state, props);
  return (
    bundleState &&
    Boolean(
      get(bundleState, [
        'entities',
        rewordingCommentSchema.key,
        String(props.commentId),
      ]),
    )
  );
};

export const selectRewordingLikesCount = (state, props) => 
  get(state, [REDUCER_KEY, 'likes', String(props.rewordingId), 'rewordingLikesCount']);

export const selectIsDeteting = (state, props) => {
  const { nodeId } = props;
  const bundleState = selectBundleState(state, props);
  return bundleState && bundleState.deletingNodes[nodeId]
}

export const selectUserDraftsState = createSelector(
  (state) => get(state, [REDUCER_KEY, 'userDrafts']),
  selectEntities,
  (state, entities) => {
    if (!state.data && !state.loaded.length) {
      return state;
    }
    return {
      ...state,
      data: denormalize(state.data, [dimzouBundleDescSchema], entities),
      loaded: denormalize(state.loaded, [dimzouBundleDescSchema], entities),
    }
  }
);

export const selectUserRelatedDrafts = createSelector(
  (state, props) => get(state, [REDUCER_KEY, 'userRelated', props.userId]),
  selectEntities,
  (state, entities) => {
    if (!state || (!state.data && !state.loaded)) {
      return state;
    }
    return {
      ...state,
      data: denormalize(state.data, [dimzouBundleDescSchema], entities),
      loaded: denormalize(state.loaded, [dimzouBundleDescSchema], entities),
    }
  }
);

export const selectInvitationContext = (state) => get(state, [REDUCER_KEY, 'workspace', 'invitationContext']);
export const selectUserInvitationCode = (state, props) => {
  const nodeState = selectNodeState(state, props);
  return nodeState && nodeState.userInvitations[0];
}

// PUBLICATION
export const selectPublicationBundleState = createSelector(
  (state, props) => get(state, [REDUCER_KEY, 'publications', 'desc', props.bundleId]),
  selectEntities,
  (descState, entityMap) => {
    if (!descState) {
      return descState;
    }
    return denormalize(descState, { data: dimzouBundleDescSchema }, entityMap)
  }
)
export const selectNodePublication = createSelector(
  (state, props) => get(state, [REDUCER_KEY, 'publications', 'nodes', props.nodeId]),
  selectEntities,
  (nodeState, entityMap) => {
    if (!nodeState) {
      return nodeState;
    }
    return denormalize(nodeState, { data: publicationSchema }, entityMap);
  }
)

// Dashboard related
export const selectPlainDimzouReports = (state) =>
  get(state, [REDUCER_KEY, 'dashboard', 'dimzouReports']);

export const selectDimzouReports = createSelector(
  selectPlainDimzouReports,
  selectEntities,
  (state, entityMap) => {
    const list = denormalize(state.list, [dimzouBundleDescSchema], entityMap);
    return {
      ...state,
      list,
    };
  },
);


export const selectReaderReport = (state) =>
  get(state, [REDUCER_KEY, 'dashboard', 'readerReport']);

export const selectPlainReaderTaste = (state) =>
  get(state, [REDUCER_KEY, 'dashboard', 'readerTaste']);


export const selectReaderTaste = createSelector(
  selectPlainReaderTaste,
  selectEntities,
  (state, entityMap) => {
    const list = denormalize(state.list, [dimzouBundleDescSchema], entityMap);
    return {
      ...state,
      list,
    };
  },
);

export const selectReaderCommented = (state) =>
  get(state, [REDUCER_KEY, 'dashboard', 'commented']);