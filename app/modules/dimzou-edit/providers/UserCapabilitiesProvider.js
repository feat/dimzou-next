import { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

import { selectCurrentUserId } from '@/modules/auth/selectors';
import {
  BundleContext,
  NodeContext,
  UserCapabilitiesContext,
} from '../context';
import { isAdmin, isOwner, getUserRole } from '../utils/collaborators';
// import { isOriginBundle } from '../utils/bundle';
import { BUNDLE_STATUS_PUBLISHED, NODE_TYPE_CHAPTER } from '../constants';

function UserCapabilitiesProvider(props) {
  const nodeState = useContext(NodeContext);
  const bundleState = useContext(BundleContext);
  const currentUserId = useSelector(selectCurrentUserId);
  const collaborators = get(nodeState, 'basic.collaborators');
  const editPermission = get(nodeState, 'basic.permission');
  const features = get(bundleState, 'features');
  const userCapabilities = useMemo(
    () => {
      if (!features || !collaborators || editPermission === null) {
        return {};
      }

      const userIsAdmin = isAdmin(currentUserId, collaborators, editPermission);
      const userIsOwner = isOwner(currentUserId, collaborators, editPermission);
      const userRole = getUserRole(
        currentUserId,
        collaborators,
        editPermission,
      );
      const published =
        bundleState.data && bundleState.data.status === BUNDLE_STATUS_PUBLISHED;

      let canEdit = true;
      if (published) {
        canEdit = false;
      }
      // else if (bundleState.data.is_multi_chapter) {
      //   if (isOriginBundle(bundleState.data) && nodeState.basic.type === NODE_TYPE_CHAPTER) {
      //     canEdit = false;
      //   }
      // }

      return {
        isAdmin: userIsAdmin,
        isOwner: userIsOwner,
        role: userRole,
        canChangeEditPermission: userIsOwner,
        canAssignAdmin: userIsOwner,
        canInviteCollaborator: userRole !== null,
        canElect: userIsOwner || userIsAdmin,
        canCreateChapter: features.canCreateChapter && userIsOwner,
        canChangeTemplate:
          features.canChangeTemplate &&
          nodeState.basic.type === NODE_TYPE_CHAPTER &&
          userIsOwner,
        canPublish: userIsOwner && !published,
        canEdit,
        canAppendContent: canEdit && features.canAppendContent,
      };
    },
    [collaborators, editPermission, features, currentUserId],
  );
  return (
    <UserCapabilitiesContext.Provider value={userCapabilities}>
      {props.children}
    </UserCapabilitiesContext.Provider>
  );
}

UserCapabilitiesProvider.propTypes = {
  children: PropTypes.node,
};

export default UserCapabilitiesProvider;
