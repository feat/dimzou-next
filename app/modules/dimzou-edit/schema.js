import { schema } from 'normalizr';

const user = new schema.Entity('users', undefined, {
  idAttribute: 'uid',
});

const category = new schema.Entity('categories');

export const collaborator = new schema.Entity('dzCollaborators', {
  user,
});

export const dimzouBundleDesc = new schema.Entity('dzBundleDescs');
export const dimzouNodeDesc = new schema.Entity('dzNodeDescs');
export const dimzouPublication = new schema.Entity('dzPublications');

export const rewordingComment = new schema.Entity('dzRewordingComments');

dimzouBundleDesc.define({
  nodes: [dimzouNodeDesc],
  user,
  category,
  all_copies: [dimzouBundleDesc],
  collaborators: [collaborator],
});

dimzouNodeDesc.define({
  user,
  collaborators: [collaborator],
});

dimzouPublication.define({
  author: user,
  translator: user,
  // category,
  related: [dimzouPublication],
  // likes: [like],
  nodes: [dimzouNodeDesc],
});

rewordingComment.define({
  user,
  children: [rewordingComment],
});

// export const attachment = new schema.Entity(
//     'attachments',
//     {},
//     {
//       idAttribute: 'attachmentId',
//     },
//   );
export const dimzouBundle = new schema.Entity('dzBundles');
//   export const dimzouNode = new schema.Entity('dimzouNodes');
//   export const rewording = new schema.Entity('dimzouRewordings', {
//     user,
//   });
//   export const block = new schema.Entity('dimzouBlocks', {
//     rewordings: [rewording],
//   });

//   export const rewordingLike = new schema.Entity('rewordingLikes', {
//     user,
//   });

dimzouBundle.define({
  user,
  collaborators: [collaborator],
});
//   dimzouNode.define({
//     user,
//     title: block,
//     summary: block,
//     // category,
//     cover: block,
//     content: [block],
//     user_rewording_likes: [rewordingLike],
//     // likes: [like],
//   });
