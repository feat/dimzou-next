import get from 'lodash/get';
import update from 'immutability-helper';
import merge from '@/utils/merge';

import * as schemas from '@/schema';

const initialState = {};
Object.values(schemas).forEach((schema) => {
  if (schema && schema.key) {
    initialState[schema.key] = {};
  }
});

export default function entityReducer(state = initialState, action) {
  const entities = get(action, 'payload.entities');
  const entityMutators = get(action, 'payload.entityMutators');
  
  let nextState = state;
  if (entities) {
    nextState = merge(nextState, entities);
  }
  if (entityMutators) {
    // logging.debug(action.type, entityMutators);
    nextState = entityMutators.reduce(
      (prevState, mutator) => update(prevState, mutator),
      nextState,
    );
  }
  return nextState;
}
