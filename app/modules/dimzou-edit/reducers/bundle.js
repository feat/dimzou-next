import { mapHandleActions } from '@/utils/reducerCreators';
import {
  closeInvitation,
  fetchBundleEditInfo,
  fetchBundleEditInfoFailure,
  initBundle,
  loadBundleEditInfo,
  openInvitation,
  release,
} from '../actions';

import {
  EDIT_MODE_ORIGIN,
  EDIT_MODE_TRANSLATION,
  CONTENT_TYPE_TRANSLATE,
  FEATURES_OMCB,
  FEATURES_OSCB,
  FEATURES_TB,
} from '../constants';

export const initialBundleState = {
  isReady: false,
  isFetchingEditInfo: false,
  fetchError: null,
  data: null, // bundle data
  features: undefined,
  // config
  cachedTemplate: undefined,
  cachedEditPermission: undefined,
  cachedNewCollaborators: [],
  cachedUpdatedCollaborators: {},

  // nodes
  deletingNodes: {},

  // chapter creation
  isCreatingNode: false,
  isChapterCreationPanelOpened: false,
  isCoverNodeCreationPanelOpened: false,

  // release
  isReleasePanelOpened: false,
  releaseStep: undefined,
  releaseTarget: null,
  releaseValidationProcessing: false,
  releaseValidationError: null,
  releaseCategory: undefined,
  isReleasing: false,
};

const getBundleFeatures = (data) => {
  if (data.type === CONTENT_TYPE_TRANSLATE) {
    return FEATURES_TB;
  } if (data.is_multi_chapter) {
    return FEATURES_OMCB
  }
  return FEATURES_OSCB
}

const bundleEditReducer = mapHandleActions(
  {
    [initBundle]: (bundleState, action) => {
      const {
        payload: { invitationCode },
      } = action;
      return {
        ...bundleState,
        invitationCode,
        fetchError: null,
      };
    },
    [fetchBundleEditInfo]: (bundleState) => ({
      ...bundleState,
      isFetchingEditInfo: true,
    }),
    [fetchBundleEditInfoFailure]: (bundleState, action) => {
      const {
        payload: { data: error },
      } = action;
      return {
        ...bundleState,
        isFetchingEditInfo: false,
        fetchError: error,
      };
    },
    [loadBundleEditInfo]: (bundleState, action) => {
      const {
        payload: { data },
      } = action;
      return {
        ...bundleState,
        isFetchingEditInfo: false,
        isReady: true,
        fetchError: null,
        mode: data.type === CONTENT_TYPE_TRANSLATE ? 
          EDIT_MODE_TRANSLATION : EDIT_MODE_ORIGIN,
        features: getBundleFeatures(data),
      };
    },
    [openInvitation]: (bundleState, action) => {
      const {
        payload: { data },
      } = action;
      return {
        ...bundleState,
        isInvitationPanelOpened: true,
        invitationInfo: data,
      };
    },
    [closeInvitation]: (bundleState) => ({
      ...bundleState,
      isInvitationPanelOpened: false,
      invitationInfo: null,
    }),
    [release.REQUEST]: (bundleState) => ({
      ...bundleState,
      isReleasing: true,
    }),
    [release.FULFILL]: (bundleState) => ({
      ...bundleState,
      isReleasing: false,
    }),
  },
  initialBundleState,
  (action) => action.payload.bundleId,
);

export default bundleEditReducer;
