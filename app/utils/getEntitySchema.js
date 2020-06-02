import camelCase from 'lodash/camelCase';
import * as schemas from '@/schema';

export default function getEntitySchema(entityType) {
  return schemas[camelCase(entityType)];
}
