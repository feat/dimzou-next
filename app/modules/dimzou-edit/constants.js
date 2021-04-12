export const EDIT_PERMISSION_PUBLIC = 0;
export const EDIT_PERMISSION_GROUP = 100;

export const BUNDLE_TYPE_TRANSLATE = 2; // publication
export const BUNDLE_TYPE_ORIGIN = 1; // publication

export const BUNDLE_STATUS_DRAFT = 0;
export const BUNDLE_STATUS_PUBLISHED = 200;

export const CONTENT_TYPE_TRANSLATE = 100;
export const CONTENT_TYPE_ORIGIN = 0;

export const ROLE_OWNER = 0;
export const ROLE_ADMIN = 100;
export const ROLE_PARTICIPATOR = 200;
export const ROLE_BLOCKED = -1;

export const REWORDIND_MEDIA_TYPE_TEXT = 0;
export const REWORDIND_MEDIA_TYPE_CODE_BLOCK = 100;
export const REWORDIND_MEDIA_TYPE_MATH_EQUATION = 200;
export const REWORDIND_MEDIA_TYPE_IMAGE = 300;
export const REWORDIND_MEDIA_TYPE_FILE = 400;

export const REWORDING_STATUS_PENDING = 0;
export const REWORDING_STATUS_REJECTED = 200;
export const REWORDING_STATUS_ACCEPTED = 100;
export const REWORDING_STATUS_DELETED = 300;

export const BLOCK_STATUS_PENDING = 0;
export const BLOCK_STATUS_REJECTED = 1;
export const BLOCK_STATUS_ACCEPTED = 2;
export const BLOCK_STATUS_DELETED = 3;

export const SOCIAL_INVITATION_TYPE_PUBLIC = 0;
export const SOCIAL_INVITATION_TYPE_SPECIFIC = 1;

export const IS_NOT_SELECTED_FLAG = false;
export const IS_SELECTED_FLAG = true;

export const NODE_STATUS_DRAFT = 0;
export const NODE_STATUS_PUBLISHED = 100;

export const NODE_STRUCTURE_TITLE = 0;
export const NODE_STRUCTURE_SUMMARY = 100;
export const NODE_STRUCTURE_CONTENT = 200;
export const NODE_STRUCTURE_COVER = 300;

export const structureMap = {
  [NODE_STRUCTURE_TITLE]: 'title',
  [NODE_STRUCTURE_SUMMARY]: 'summary',
  [NODE_STRUCTURE_CONTENT]: 'content',
  [NODE_STRUCTURE_COVER]: 'cover',
};

// rewording action;
export const ACTION_ELECT_REWORDING = 'elect-rewording';
export const ACTION_REJECT_REWORDING = 'reject-rewording';
export const ACTION_SUBMIT_REWORDING = 'submit-rewording';
export const ACTION_COMMIT_REWORDING = 'commit-rewording';
export const ACTION_UPDATE_REWORDING = 'update-rewording';
// block action;
// export const ACTION_ELECT_BLOCK = 'elect-block';
// export const ACTION_REJECT_BLOCK = 'reject-block';
export const ACTION_SUBMIT_BLOCK = 'submit-block';
export const ACTION_COMMIT_BLOCK = 'commit-block';
export const ACTION_REMOVE_BLOCK = 'remove-block';
// collaborator action;
export const ACTION_ADD_COLLABORATOR = 'add-collaborator';
export const ACTION_UPDATE_COLLABORATOR = 'update-collaborator';
export const ACTION_REMOVE_COLLABORATOR = 'remove-collaborator';
// config action;
export const ACTION_UPDATE_EDIT_CONFIG = 'update-edit-config';
export const ACTION_CHANGE_TEMPLATE = 'change-template';
export const ACTION_CHANGE_EDIT_PERMISSION = 'change-edit-permission';

// Attachment
export const ATTACHMENT_MAX_SIZE = 6; // 6m;

// Block
export const BLOCK_CONTENT_TYPE_TEXT = 'text';
export const BLOCK_CONTENT_TYPE_CODE_BLOCK = 'code-block';
export const BLOCK_CONTENT_TYPE_MEDIA = 'media-block';

export const BLOCK_EXPANDED_SECTION_VERSIONS = 'versions';
export const BLOCK_EXPANDED_SECTION_COMMENTS = 'comments';

// EDIT Component;
export const TAILING_INSERT_BLOCK_KEY = 'TAILING_INSERT_BLOCK_KEY';
export const INSERT_TYPE_PIVOT = 'PIVOT';
export const INSERT_TYPE_TAILING = 'TAILING';
export const BEGINNING_PIVOT = -1;
export const TAILING_PIVOT = 'TAILING_PIVOT';
export const STATIC_CONTNET_KEY = 'STATIC_CONTNET_KEY';
export const MEDIA_PLACEHOLDER_KEY = 'MEDIA_PLACEHOLDER_KEY';

export const EDIT_MODE_ORIGIN = 'origin';
export const EDIT_MODE_TRANSLATION = 'translation';

export const NODE_TYPE_CHAPTER = 0;
export const NODE_TYPE_COVER = 100;

export const BUNDLE_TYPE_MULTI_CHAPTER = 'multi';
export const BUNDLE_TYPE_SINGLE = 'single';

export const RELEASE_TYPE_ALL = 'all';
export const RELEASE_TYPE_SELECTED = 'selected';

// Block
export const BLOCK_KEY_SEPARATOR = '-';

// Chapter template
export const CHAPTER_TEMPLATE_I = 'I';
export const CHAPTER_TEMPLATE_II = 'II';
export const CHAPTER_TEMPLATE_III = 'III';
export const CHAPTER_TEMPLATE_IV = 'IV';
export const CHAPTER_TEMPLATE_V = 'V';

// Rewording Widget
export const REWORDING_WIDGET_TEXT_EDITOR = 'text-editor';
export const REWORDING_WIDGET_IMAGE = 'image';
export const REWORDING_WIDGET_MEDIA = 'media';
export const REWORDING_WIDGET_CODE_BLOCK = 'code-block';

export const COVER_SUMMARY_ID = '__SUMMARY__';
export const COVER_TITLE_ID = '__COVER__';

// DnD
export const DRAGGABLE_TYPE_BLOCK = 'DZ/BLOCK';
export const DRAGGABLE_TYPE_REWORDING = 'DZ/REWORDING';
export const DRAGGABLE_RESOURCE_NODE = 'DZ/RESOURCE_NODE';
export const DRAGGABLE_TYPE_COLLABORATOR = 'DZ/COLLABORATOR';

export const DRAG_TO_DELETE_DELTA = 120;
export const MAX_TITLE_LENGTH = 100;

// Features
// ORIGIN_MULTI_CHAPTER_BUNDLE
export const FEATURES_OMCB = {
  canCreateChapter: true,
  canAppendContent: true,
  canChangeTemplate: false,
};

// ORIGIN_SINGLE_CHAPTER_BUNDLE
export const FEATURES_OSCB = {
  canCreateChapter: false,
  canAppendContent: true,
  canChangeTemplate: true,
};

// TRANSLATION BUNDLE
export const FEATURES_TB = {
  canCreateChapter: false,
  canAppendContent: false,
  canChangeTemplate: false,
};
