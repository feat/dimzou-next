import { schema } from 'normalizr';

const user = new schema.Entity('users', undefined, {
  idAttribute: 'uid',
});

export const comment = new schema.Entity('comments');
comment.define({
  user,
  children: [comment],
});
