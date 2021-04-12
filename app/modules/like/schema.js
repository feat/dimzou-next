import { schema } from 'normalizr';

const user = new schema.Entity('users', undefined, {
  idAttribute: 'uid',
});
export const like = new schema.Entity('likes', {
  user,
});
