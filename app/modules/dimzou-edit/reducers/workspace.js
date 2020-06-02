import update from 'immutability-helper'
import {
  handleActions,
} from 'redux-actions'
import {
  initCreateChapter,
  exitCreateChapter,
  initCreateCover,
  exitCreateCover,
  initRelease,
  exitRelease,
  setReleaseStep,
  setReleaseData,
  createNode,
  openInvitation,
  closeInvitation,
  resetWorkspaceCreation,
  createCopyBundle,
  showCurrentUserDrafts,
  initSectionRelease,
  exitSectionRelease,
  setSectionReleaseData,
  sectionRelease,
  setSidebarHasFocus,
} from '../actions'

export const initialState = {
  isChapterCreationPanelOpened: false,
  chapterCreationContext: null,
  isCoverNodeCreationPanelOpened: false,
  isReleasePanelOpened: false,
  releaseContext: null, // { bundle, nodes, initialValues }
  isInvitationPanelOpened: false,
  invitationContext: null,
  requests: {},
  displayCurrentUserDrafts: false,
  isSectionReleasePanelOpened: false,
  sectionReleaseContext: null,
  isSectionReleasing: false,
}

const reducer = handleActions({
  [setSidebarHasFocus]: (state, action) => ({
    ...state,
    sidebarHasFocus: action.payload,
  }),
  [initCreateChapter]: (state, action) => ({
    ...state,
    isChapterCreationPanelOpened: true,
    isCoverCreationPanelOpened: false,
    chapterCreationContext: action.payload,
  }),
  [exitCreateChapter]: (state) => ({
    ...state,
    isChapterCreationPanelOpened: false,
    chapterCreationContext: null,
  }),

  [initCreateCover]: (state) => ({
    ...state,
    isCoverCreationPanelOpened: true,
    isChapterCreationPanelOpened: false,
    chapterCreationContext: null,
  }),
  [exitCreateCover]: (state) => ({
    ...state,
    isCoverCreationPanelOpened: false,
  }),
  [resetWorkspaceCreation]: (state) => ({
    ...state,
    isCoverCreationPanelOpened: false,
    isChapterCreationPanelOpened: false,
    chapterCreationContext: null,
  }),

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
    const {
      payload,
    } = action;
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
  [setReleaseData]: (state, action) => update(state, {
    releaseContext: (data) => ({
      ...data,
      ...action.payload,
    }),
  }),
  [setReleaseStep]: (state, action) => update(state, {
    releaseContext: {
      step: {
        $set: action.payload,
      },
    },
  }),
  [createCopyBundle.REQUEST]: (state, action) => update(state, {
    requests: {
      [`copy_bundle.${action.payload.bundleId}`]: {
        $set: true,
      },
    },
  }),
  [createCopyBundle.FULFILL]: (state, action) => update(state, {
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
    sectionReleaseContext: ({
      ...state.sectionReleaseContext,
      ...action.payload,
    }),
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
}, initialState)

export default reducer;