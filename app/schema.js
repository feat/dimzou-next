import { schema } from 'normalizr';

export const user = new schema.Entity('users', undefined, {
  idAttribute: 'uid',
});

export const category = new schema.Entity('categories');
export const expCategory = new schema.Entity('expCategories');

/**
 * Activity
 */
export const comment = new schema.Entity('comments');
comment.define({
  user,
  children: [comment],
});
export const like = new schema.Entity('likes', {
  user,
});

/**
 * Group
 */
export const groupMember = new schema.Entity('members');
export const group = new schema.Entity('groups');

/**
 * Party related
 */
export const inboxMessage = new schema.Entity('inboxMessages');
export const archiveMessage = new schema.Entity('archiveMessages');
export const friend = new schema.Entity('friends');
export const contact = new schema.Entity('contacts', {
  group,
});

/**
 * Xfile
 */
export const xfilePlate = new schema.Entity('xfilePlates');
export const xfileEvent = new schema.Entity('xfileEvents', {
  plates: [xfilePlate],
});

/**
 * UserInfo
 */
export const language = new schema.Entity('userLanguages');
export const career = new schema.Entity('userCareers');
export const education = new schema.Entity('userEducations');
export const honor = new schema.Entity('userHonors');
export const expertise = new schema.Entity('userExpertises');
export const address = new schema.Entity('userAddresses');

export const profile = new schema.Entity(
  'profiles',
  {},
  {
    idAttribute: 'uid',
  },
);

export const userInfo = new schema.Entity(
  'userInfos',
  {
    profile,
    languages: [language],
    educations: [education],
    career_experiences: [career],
    honors_awards: [honor],
    expertise: [expertise],
    workplace: address,
  },
  {
    idAttribute: 'uid',
  },
);

/**
 * Commerce
 */
export const serviceOrder = new schema.Entity('serviceOrders');
export const serviceDemand = new schema.Entity('serviceDemands', {
  user,
  order: serviceOrder,
});
/**
 * Dimzou
 */

export const attachment = new schema.Entity(
  'attachments',
  {},
  {
    idAttribute: 'attachmentId',
  },
);
export const dimzouBundle = new schema.Entity('dimzouBundles');
export const dimzouNode = new schema.Entity('dimzouNodes');
export const rewording = new schema.Entity('dimzouRewordings', {
  user,
});
export const block = new schema.Entity('dimzouBlocks', {
  rewordings: [rewording],
});
export const collaborator = new schema.Entity('dimzouCollaborators', {
  user,
});
export const rewordingLike = new schema.Entity('rewordingLikes', {
  user,
});
export const rewordingComment = new schema.Entity('rewordingComments');

export const dimzouBundleDesc = new schema.Entity('dimzouBundleDescs');
export const dimzouNodeDesc = new schema.Entity('dimzouNodeDescs');

dimzouBundleDesc.define({
  nodes: [dimzouNodeDesc],
  user,
  all_copies: [dimzouBundleDesc],
})

rewordingComment.define({
  user,
  children: [rewordingComment],
});
dimzouBundle.define({
  user,
  collaborators: [collaborator],
});
dimzouNode.define({
  user,
  title: block,
  summary: block,
  category,
  cover: block,
  content: [block],
  user_rewording_likes: [rewordingLike],
  likes: [like],
});

export const feed = new schema.Entity('feeds');

export const dimzouPublication = new schema.Entity('dimzouPublications');
dimzouPublication.define({
  author: user,
  translator: user,
  category,
  related: [dimzouPublication],
  likes: [like],
  nodes: [dimzouNode],
});
