import update from 'immutability-helper';
import { handleActions } from 'redux-actions';
import {
  initRelease,
  exitRelease,
  setReleaseStep,
  setReleaseData,
  createNode,
  openInvitation,
  closeInvitation,
  createCopyBundle,
  showCurrentUserDrafts,
  initSectionRelease,
  exitSectionRelease,
  setSectionReleaseData,
  sectionRelease,
  initBlockEdit,
  exitBlockEdit,
} from '../actions';

export const initialState = {
  isReleasePanelOpened: false,
  releaseContext: null, // { bundle, nodes, initialValues }
  isInvitationPanelOpened: false,
  invitationContext: null,
  isSectionReleasePanelOpened: false,
  sectionReleaseContext: null,
  isSectionReleasing: false,
  isEditingCover: false,

  sidebarHasFocus: false,

  requests: {},
};

const reducer = handleActions(
  {
    [createNode.REQUEST]: (state) => ({
      ...state,
      isCreatingNode: true,
    }),
    [createNode.FULFILL]: (state) => ({
      ...state,
      isCreatingNode: false,
    }),

    // -- Invitation
    [openInvitation]: (state, action) => ({
      ...state,
      isInvitationPanelOpened: true,
      invitationContext: action.payload,
    }),
    [closeInvitation]: (state) => ({
      ...state,
      isInvitationPanelOpened: false,
      invitationContext: null,
    }),

    // -- Release
    [initRelease]: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        isReleasePanelOpened: true,
        releaseContext: payload,
      };
    },
    [exitRelease]: (state) => ({
      ...state,
      isReleasePanelOpened: false,
      releaseContext: null,
    }),
    [setReleaseData]: (state, action) =>
      update(state, {
        releaseContext: (data) => ({
          ...data,
          ...action.payload,
        }),
      }),
    [setReleaseStep]: (state, action) =>
      update(state, {
        releaseContext: {
          step: {
            $set: action.payload,
          },
        },
      }),
    [createCopyBundle.REQUEST]: (state, action) =>
      update(state, {
        requests: {
          [`copy_bundle.${action.payload.bundleId}`]: {
            $set: true,
          },
        },
      }),
    [createCopyBundle.FULFILL]: (state, action) =>
      update(state, {
        requests: {
          [`copy_bundle.${action.payload.bundleId}`]: {
            $set: false,
          },
        },
      }),
    [showCurrentUserDrafts]: (state, action) => ({
      ...state,
      displayCurrentUserDrafts: action.payload,
    }),
    [initSectionRelease]: (state, action) => ({
      ...state,
      isSectionReleasePanelOpened: true,
      sectionReleaseContext: action.payload,
    }),
    [exitSectionRelease]: (state) => ({
      ...state,
      isSectionReleasePanelOpened: false,
      sectionReleaseContext: null,
    }),
    [setSectionReleaseData]: (state, action) => ({
      ...state,
      sectionReleaseContext: {
        ...state.sectionReleaseContext,
        ...action.payload,
      },
    }),
    [sectionRelease.REQUEST]: (state) => ({
      ...state,
      isSectionReleasing: true,
    }),
    [sectionRelease.SUCCESS]: (state) => ({
      ...state,
      isSectionReleasePanelOpened: false,
      sectionReleaseContext: null,
    }),
    [sectionRelease.FULFILL]: (state) => ({
      ...state,
      isSectionReleasing: false,
    }),
    [initBlockEdit]: (state, action) => {
      if (action.payload.structure === 'cover') {
        return {
          ...state,
          isEditingCover: true,
        };
      }
      return state;
    },
    [exitBlockEdit]: (state, action) => {
      if (action.payload.structure === 'cover') {
        return {
          ...state,
          isEditingCover: false,
        };
      }
      return state;
    },
  },
  initialState,
);

export default reducer;
