import get from 'lodash/get';
import { ROLE_OWNER } from '../constants';

let lastTemplate = 'I'; // global cached;
export const getTemplate = (stateInfo) => {
  if (!stateInfo) {
    return lastTemplate;
  }
  if (stateInfo.cachedTemplate) {
    return stateInfo.cachedTemplate;
  }
  if (stateInfo.basic && stateInfo.basic.template_config) {
    lastTemplate = stateInfo.basic.template_config.chapter_template; // node data;
  } else if (stateInfo.data && stateInfo.data.template) {
    lastTemplate = stateInfo.data.template; // publication data;
  }
  return lastTemplate;
};

// export const getTemplate = () => 'I';

export function getOwner(bundleDesc) {
  const collaborators = get(bundleDesc, 'nodes.0.collaborators');
  if (!collaborators) {
    return null;
  }
  const c = collaborators.find((item) => item.role === ROLE_OWNER);
  if (c && c.user) {
    return c.user;
  }
  // TO_ENHANCE: 实现一个 Model service 来获取实体数据
  if (c && c.user_id) {
    return { uid: c.user_id };
  }
  return null;
}
