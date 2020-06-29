import { defineMessages } from '@/services/intl';
import {
  CHAPTER_TEMPLATE_I,
  CHAPTER_TEMPLATE_II,
  CHAPTER_TEMPLATE_III,
  CHAPTER_TEMPLATE_IV,
  CHAPTER_TEMPLATE_V,
  ROLE_OWNER,
  ROLE_ADMIN,
  ROLE_PARTICIPATOR,
  ROLE_BLOCKED,
} from './constants';

export default defineMessages({
  draft: {
    id: 'dz.dimzou-edit.draft',
    defaultMessage: 'Draft',
  },
  candidate: {
    id: 'dz.dimzou-edit.candidate',
    defaultMessage: 'Candidate: ',
  },
  archived: {
    id: 'dz.dimzou-edit.archived',
    defaultMessage: 'Archived: ',
  },
  abandoned: {
    id: 'dz.dimzou-edit.abandoned',
    defaultMessage: 'Abandoned: ',
  },
  titlePlaceholder: {
    id: 'dz.dimzou-edit.title-placeholder',
    defaultMessage: 'Title',
  },
  summaryPlaceholder: {
    id: 'dz.dimzou-edit.summary-placeholder',
    defaultMessage: 'Summary',
  },
  emptyTitlePlaceholder: {
    id: 'dz.dimzou-edit.empty-title-placeholder',
    defaultMessage: '<Title>',
  },
  emptySummaryPlaceholder: {
    id: 'dz.dimzou-edit.empty-summary-placeholder',
    defaultMessage: '<Summary>',
  },
  emptyCoverPlaceholder: {
    id: 'dz.dimzou-edit.empty-cover-placeholder',
    defaultMessage: '<Cover>',
  },
  newChapter: {
    id: 'dz.dimzou-edit.new-chapter',
    defaultMessage: 'New Chapter',
  },
  releaseLabel: {
    id: 'dz.dimzou-edit.release',
    defaultMessage: 'Release',
  },
  template: {
    id: 'dz.dimzou-edit.template',
    defaultMessage: 'Template',
  },
  collaborator: {
    id: 'dz.dimzou-edit.collaborator',
    defaultMessage: 'Collaborator',
  },
  publicLabel: {
    id: 'dz.dimzou-edit.public-label',
    defaultMessage: 'Public',
  },
  groupOnly: {
    id: 'dz.dimzou-edit.group-label',
    defaultMessage: 'Group Only',
  },
  nothingToSubmit: {
    id: 'dz.dimzou-edit.nothing-to-submit',
    defaultMessage: 'Nothing to submit.',
  },
  nothingToUpdate: {
    id: 'dz.dimzou-edit.nothing-to-update',
    defaultMessage: 'Nothing to update.',
  },
  imageRewordMethodHint: {
    id: 'dz.dimzou-edit.image-reword-method-hint',
    defaultMessage: 'Drop a new image to update.',
  },
  imageRewordMethodHintForAdmin: {
    id: 'dz.dimzou-edit.image-reword-method-hint-for-admin',
    defaultMessage: 'Drop a new image to replace.',
  },
  hasPendingRewordForBlock: {
    id: 'dz.dimzou-edit.has-pending-reword-for-block',
    defaultMessage: 'You have pending reword for this block.',
  },
  canNotEditPendingRewording: {
    id: 'dz.dimzou-edit.can-not-edit-pending-rewording',
    defaultMessage: 'You can not edit on a pending rewording.',
  },
  insertEditorPlaceholder: {
    id: 'dz.dimzou-edit.insert-editor-placeholder',
    defaultMessage: 'Insert Content',
  },
  tailingEditorPlaceholder: {
    id: 'dz.dimzou-edit.tailing-editor-placeholder',
    defaultMessage: 'Submit Content',
  },
  categoryLabel: {
    id: 'dz.dimzou-edit.category-label',
    defaultMessage: 'Category',
  },
  languageLabel: {
    id: 'dz.dimzou-edit.language-label',
    defaultMessage: 'Language',
  },
  applyScenesLabel: {
    id: 'dz.dimzou-edit.apply-scenes',
    defaultMessage: 'Apply Scenes',
  },
  selectCategoryHint: {
    id: 'dz.dimzou-edit.select-category-hint',
    defaultMessage: 'Please select a category.',
  },
  dropImageTips: {
    id: 'dz.dimzou-edit.drop-image-tips',
    defaultMessage: 'Drag and drop a face photo here',
  },
  deleteBundle: {
    id: 'dz.dimzou-edit.delete-bundle',
    defaultMessage: 'Delete',
  },
  confirmToDeleteBundle: {
    id: 'dz.dimzou-edit.confirm-to-delete-bundle',
    defaultMessage: 'Confirm to delete ?',
  },
  deleteNode: {
    id: 'dz.dimzou-edit.delete-node',
    defaultMessage: 'Delete',
  },
  restoreNode: {
    id: 'dz.dimzou-edit.restore-node',
    defaultMessage: 'Restore',
  },
  visibilityOnReadingPage: {
    id: 'dz.dimzou-edit.visibility-on-reading-page',
    defaultMessage: 'Visibility on reading page',
  },
  restoreToEditHint: {
    id: 'dz.dimzou-edit.restore-to-edit-hint',
    defaultMessage: 'Deleted. You may restore before editing.',
  },
  hasInteration: {
    id: 'dz.dimzou-edit.has-interation',
    defaultMessage: 'Can not edit. Has interation on current rewording',
  },
  commentLimit: {
    id: 'dz.dimzou-edit.comment-limit',
    defaultMessage: 'You have posted a comment. You can only post a comment.',
  },
  published: {
    id: 'dz.dimzou-edit.published',
    defaultMessage: 'Published',
  },
  shouldNotBeEmpty: {
    id: 'dz.dimzou-edit.should-not-be-empty',
    defaultMessage: 'Content is required',
  },
  titleTextRequired: {
    id: 'dz.dimzou-edit.title-text-required',
    defaultMessage: 'Should have text for title',
  },
  summaryTextRequired: {
    id: 'dz.dimzou-edit.summary-text-required',
    defaultMessage: 'Should have text for summary',
  },
  diffFromRewordBase: {
    id: 'dz.dimzou-edit.diff-from-reword-base',
    defaultMessage: 'Content should be different from reword base',
  },
  userCreatedPanel: {
    id: 'dz.dimzou-edit.user-created-panel-title',
    defaultMessage: 'Drafts of {username}',
  },
  userDraftsPanel: {
    id: 'dz.dimzou-edit.user-drafts-panel',
    defaultMessage: 'My drafts',
  },
  settings: {
    id: 'dz.dimzou-edit.settings',
    defaultMessage: 'Settings',
  },
  selectACategory: {
    id: 'dz.dimzou-edit.select-a-category',
    defaultMessage: 'Select a category',
  },
  nextChapter: {
    id: 'dz.dimzou-edit.next-chapter',
    defaultMessage: 'Next: {title}',
  },
  participatedLabel: {
    id: 'dz.dimzou-edit.participated',
    defaultMessage: 'Participated',
  },
  workshop: {
    id: 'dz.dimzou-edit.workshop',
    defaultMessage: 'Workshop',
  },
  fileTypeNotSupported: {
    id: 'dz.dimzou-edit.file-type-not-supported',
    defaultMessage: 'File type not supported',
  },
  insertHint: {
    id: 'dz.dimzou-edit.insert-hint',
    defaultMessage: 'Insert content',
  },
  editing: {
    id: 'dz.dimzou-edit.editing',
    defaultMessage: 'Editing',
  },
});

export const collaboratorRole = defineMessages({
  [ROLE_OWNER]: {
    id: 'dz.collaborator-role.owner',
    defaultMessage: 'Owner',
  },
  [ROLE_ADMIN]: {
    id: 'dz.collaborator-role.admin',
    defaultMessage: 'Admin',
  },
  [ROLE_PARTICIPATOR]: {
    id: 'dz.collaborator-role.participant',
    defaultMessage: 'Participant',
  },
  [ROLE_BLOCKED]: {
    id: 'dz.collaborator-role.blocked',
    defaultMessage: 'Blocked',
  },
}, {
  prefix: 'Dimzou Collaborator role',
  fallback: (key) => ({
    id: `dz.collaborator-role.${key}`,
    defaultMessage: key,
  }),
});

export const chapterTemplateOption = defineMessages({
  [CHAPTER_TEMPLATE_I]: {
    id: 'dz.chapter-template.i-label',
    defaultMessage: 'Template I',
  },
  [CHAPTER_TEMPLATE_II]: {
    id: 'dz.chapter-template.ii-label',
    defaultMessage: 'Template II',
  },
  [CHAPTER_TEMPLATE_III]: {
    id: 'dz.chapter-template.iii-label',
    defaultMessage: 'Template III',
  },
  [CHAPTER_TEMPLATE_IV]: {
    id: 'dz.chapter-template.iv-label',
    defaultMessage: 'Template IV',
  },
  [CHAPTER_TEMPLATE_V]: {
    id: 'dz.chapter-template.v-label',
    defaultMessage: 'Template V',
  },
});

export const alert = defineMessages({
  confirmLabel: {
    id: 'dz.alert.confirm-label',
    defaultMessage: 'Confirm',
  },
  removeBlockConfirm: {
    id: 'dz.alert.remove-block-confirm',
    defaultMessage: 'Sure to remove block',
  },
  reselectConfirm: {
    id: 'dz.alert.reselect-confirm',
    defaultMessage: 'Reselect as current version?',
  },
  removeCollaborator: {
    id: 'dz.alert.remove-collaborator',
    defaultMessage: 'Remove collaborator?',
  },
});

export const copyright = defineMessages({
  year: {
    id: 'dz.copyright.year',
    defaultMessage: '@{year} Copyright',
  },
})

export const createPlaceholders = defineMessages({
  title: {
    id: 'dz.dimzou-creation.title-placeholder',
    defaultMessage: 'Write Work Title Here',
  },
  summary: {
    id: 'dz.dimzou-creation.summary-placeholder',
    defaultMessage: 'Summary',
  },
  content: {
    id: 'dz.dimzou-creation.content-placeholder',
    defaultMessage: 'content',
  },
  cover: {
    id: 'dz.dimzou-creation.cover-placeholder',
    defaultMessage: 'Include a high-quality image in your story to make it more inviting to readers.',
  },
})

export const createChapterPlaceholders = defineMessages({
  title: {
    id: 'dz.chapter-creation.title-placeholder',
    defaultMessage: 'Chapter Title',
  },
  summary: {
    id: 'dz.chapter-creation.summary-placeholder',
    defaultMessage: 'Chapter Summary',
  },
  content: {
    id: 'dz.chapter-creation.content-placeholder',
    defaultMessage: 'content',
  },
})

export const createCoverPlaceholders = defineMessages({
  title: {
    id: 'dz.cover-creation.title-placeholder',
    defaultMessage: 'Title',
  },
  summary: {
    id: 'dz.cover-creation.summary-placeholder',
    defaultMessage: 'Summary',
  },
  content: {
    id: 'dz.cover-creation.content-placeholder',
    defaultMessage: 'content',
  },
})


export const validation = defineMessages({
  validationError: {
    id: 'dz.validation.validation-error',
    defaultMessage: 'Validation Error',
  },
  titleRequired: {
    id: 'dz.validation.title-required',
    defaultMessage: 'Title should not be empty.',
  },
  summaryRequired: {
    id: 'dz.validation.summary-required',
    defaultMessage: 'Summary should not be empty.',
  },
})

export const menu = defineMessages({
  createCopy: {
    id: 'dz.menu.create-copy',
    defaultMessage: 'Create copy',
  },
  addChapter: {
    id: 'dz.menu.add-chapter',
    defaultMessage: 'New chapter',
  },
  createPage: {
    id: 'dz.menu.create-page',
    defaultMessage: 'Create page',
  },
  createCover: {
    id: 'dz.menu.create-cover',
    defaultMessage: 'Create cover',
  },
  myWorkshop: {
    id: 'dz.menu.my-workshop',
    defaultMessage: 'My workshop',
  },
  sectionRelease: {
    id: 'dz.menu.section-release',
    defaultMessage: 'Release section',
  },
})

export const bundleStatus = defineMessages({
  published: {
    id: 'dz.bundle-status.published',
    defaultMessage: 'Published',
  },
  draft: {
    id: 'dz.bundle-status.draft',
    defaultMessage: 'Draft',
  },
  archived: {
    id: 'dz.bundle-status.archived',
    defaultMessage: 'Archived',
  },
})