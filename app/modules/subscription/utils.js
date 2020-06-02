import { 
  SUBSCRIPTION_ENTITY_TYPE_DIMZOU, 
  SUBSCRIPTION_ENTITY_TYPE_EVENT, 
} from './constants'

function isUserDimzouSubscription(record) {
  return record.followed_user && record.entity_type === SUBSCRIPTION_ENTITY_TYPE_DIMZOU
}
function isUserEventSubscription(record) {
  return record.followed_user && record.entity_type === SUBSCRIPTION_ENTITY_TYPE_EVENT
}

export function filterUserDimzouSubscription(arr) {
  if (!arr) {
    return [];
  }
  return arr.filter((item) => isUserDimzouSubscription(item))
}

export function filterUserEventSubscription(arr) {
  if (!arr) {
    return [];
  }
  return arr.filter((item) => isUserEventSubscription(item))
}