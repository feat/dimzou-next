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
  applyScenesDesc: {
    id: 'dz.dimzou-edit.apply-scenes-desc',
    defaultMessage:
      'Add application scenarios to your article, the more you add, the more likely other users will find your article in the scenario search.',
  },
  selectCategoryHint: {
    id: 'dz.dimzou-edit.select-category-hint',
    defaultMessage: 'Please select a category.',
  },
  inputApplyScenesHint: {
    id: 'dz.dimzou-edit.input-apply-scenes-hint',
    defaultMessage: 'Please input at least an apply scene.',
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
  my: {
    id: 'dz.dimzou-edit.my',
    defaultMessage: 'My',
  },
  workshopFilterHint: {
    id: 'dz.dimzou-edit.workshop-filter',
    defaultMessage: '筛选',
  },
  newCategoryHint: {
    id: 'dz.dimzou-edit.new-category-hint',
    defaultMessage: 'New Category',
  },
});

export const collaboratorRole = defineMessages(
  {
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
  },
  {
    prefix: 'Dimzou Collaborator role',
    fallback: (key) => ({
      id: `dz.collaborator-role.${key}`,
      defaultMessage: key,
    }),
  },
);

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
  separateNodeConfirm: {
    id: 'dz.alert.separate-node-confirm',
    defaultMessage: 'Sure to separate chapter?.',
  },
});

export const copyright = defineMessages({
  year: {
    id: 'dz.copyright.year',
    defaultMessage: '@{year} Copyright',
  },
});

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
    defaultMessage:
      'Include a high-quality image in your story to make it more inviting to readers.',
  },
});

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
});

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
});

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
});

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
});

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
});

export const release = defineMessages({
  selectCategoryHint: {
    id: 'dz.release.select-category-hint',
    defaultMessage: 'Please select a category.',
  },
  releaseTypeTitle: {
    id: 'dz.release.release-type',
    defaultMessage: 'Release Type',
  },
  standaloneRelease: {
    id: 'dz.release.standalone-release',
    defaultMessage: 'Standalone Release',
  },
  bundleRelease: {
    id: 'dz.release.bundle-release',
    defaultMessage: 'Bundle Release',
  },
  applyScenes: {
    id: 'dz.release.apply-scenes',
    defaultMessage: 'Apply Scenes',
  },
  applyScenePlaceholder: {
    id: 'dz.release.apply-scene-placeholder',
    defaultMessage: 'New Application Secene, [ENTER] to confirm',
  },
  category: {
    id: 'dz.release.category',
    defaultMessage: 'Category',
  },
  review: {
    id: 'dz.release.release-config-review',
    defaultMessage: 'Release Config Review',
  },
  contentToRelease: {
    id: 'dz.release.content-to-release',
    defaultMessage: 'Content to release',
  },
  validatingHint: {
    id: 'dz.release.validating-hint',
    defaultMessage: 'Validating...',
  },
  releasingHint: {
    id: 'dz.release.releasing-hint',
    defaultMessage: 'Releasing...',
  },
  releaseSuccessHint: {
    id: 'dz.release.release-success-hint',
    defaultMessage: 'Release Success',
  },
  validationFailed: {
    id: 'dz.release.validation-failed',
    defaultMessage: 'Validation Failed',
  },
  releaseFailed: {
    id: 'dz.release.release-failed',
    defaultMessage: 'Release Failed',
  },
  nodeToRelease: {
    id: 'dz.release.node-to-release',
    defaultMessage: 'Select content to release',
  },
  nodesRequired: {
    id: 'dz.release.nodes-required',
    defaultMessage: 'Please select nodes to release',
  },
  coverShouldReleaseForInit: {
    id: 'dz.release.cover-release-for-init',
    defaultMessage: 'Bundle should release with a cover',
  },
  publishedWithUpdate: {
    id: 'dz.release.published-with-update',
    defaultMessage: 'Published (has updates)',
  },
  notPublished: {
    id: 'dz.release.not-published',
    defaultMessage: 'Not published',
  },
  published: {
    id: 'dz.release.published',
    defaultMessage: 'Published',
  },
  titleRequired: {
    id: 'dz.release.title-required',
    defaultMessage: 'Title requried',
  },
  summaryRequired: {
    id: 'dz.release.summary-required',
    defaultMessage: 'Summary required',
  },
  coverRequired: {
    id: 'dz.release.cover-required',
    defaultMessage: 'Cover required',
  },
  sectionRelease: {
    id: 'dz.release.section-release',
    defaultMessage: 'Section Release',
  },
  cardPreview: {
    id: 'dz.release.card-preview',
    defaultMessage: 'Card Preview',
  },
  close: {
    id: 'dz.release.close',
    defaultMessage: 'Close',
  },
});

export const cardWidget = defineMessages({
  coverPlaceholder: {
    id: 'dz.card-wdiget.cover-placeholder',
    defaultMessage: 'Use high-quality images to attract more readers',
  },
  shortCoverPlaceholder: {
    id: 'dz.card-wdiget.short-cover-placeholder',
    defaultMessage: 'Use high-quality images',
  },
});

export const cardPreview = defineMessages({
  title: {
    id: 'dz.card-preview.title',
    defaultMessage: 'Card Preview',
  },
  desc: {
    id: 'dz.card-preview.desc',
    defaultMessage:
      'Note: The changes here will affect how your article is displayed on public pages such as the feat.com homepage, not the article itself.',
  },
  titleRequried: {
    id: 'dz.card-preview.title-required',
    defaultMessage: 'Please input title',
  },
  summaryRequired: {
    id: 'dz.card-preview.summary-required',
    defaultMessage: 'Please input summary',
  },
  updateAll: {
    id: 'dz.card-preview.update-all',
    defaultMessage: 'Bulk edit',
  },
});

export const pageTitle = defineMessages({
  createCover: {
    id: 'dz.page-title.create-cover',
    defaultMessage: 'Create cover',
  },
  createPage: {
    id: 'dz.page-title.create-page',
    defaultMessage: 'Create page',
  },
});
