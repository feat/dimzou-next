import React, { useMemo, useContext, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { formatMessage } from '@/services/intl';
import { selectCurrentUserId } from '@/modules/auth/selectors';
import SvgIcon from '@feat/feat-ui/lib/svg-icon';
import Block from '@feat/feat-ui/lib/block';
import Tooltip from '@feat/feat-ui/lib/tooltip';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import intlMessages from '../../messages';
import CollaboratorDropzone from './CollaboratorDropzone';
import Collaborator from './Collaborator';

import { classifyCollaborators } from '../../utils/collaborators';

import {
  EDIT_PERMISSION_PUBLIC,
  EDIT_PERMISSION_GROUP,
  ACTION_ADD_COLLABORATOR,
  ACTION_UPDATE_COLLABORATOR,
  ROLE_ADMIN,
  ROLE_PARTICIPATOR,
  ROLE_OWNER,
  ROLE_BLOCKED,
} from '../../constants';
import {
  addCollaborator,
  updateCollaborator,
  removeCollaborator,
  changeEditPermission,
  asyncFetchCollaborators,
} from '../../actions';

import { NodeContext, UserCapabilitiesContext, WorkspaceContext } from '../../context'
import ownerIcon from '../../assets/icon-role-owner.svg'
import adminIcon from '../../assets/icon-role-admin.svg'
import participatorIcon from '../../assets/icon-role-participator.svg'
import blockedIcon from '../../assets/icon-role-blocked.svg'

function CollaboratorBlock() {
  const nodeState = useContext(NodeContext)
  const userCapabilities = useContext(UserCapabilitiesContext)
  const workspace = useContext(WorkspaceContext)
  const currentUserId = useSelector(selectCurrentUserId);
  const dispatch = useDispatch();
  const collaborators = nodeState && nodeState.data ? nodeState.data.collaborators : [];
  const nodeWords = useMemo(() => collaborators.reduce((a, b) => a + b.contributing_words, 0), [collaborators]);
  const { owner, admins, participators, blocked } = useMemo(() => classifyCollaborators(collaborators),  [
    collaborators,
  ]);
  const editPermission = nodeState && nodeState.data ? nodeState.data.permission : undefined;

  const updatePermission = useCallback((permission) => {
    if (editPermission === permission) {
      return;
    }
    dispatch(changeEditPermission({
      bundleId: workspace.bundleId,
      nodeId: workspace.nodeId,
      editPermission: permission,
    }));
  });

  const handleDropzone = useCallback((data) => {
    switch (data.type) {
      case ACTION_ADD_COLLABORATOR:
        dispatch(addCollaborator({
          bundleId: workspace.bundleId,
          nodeId: workspace.nodeId,
          userId: data.user.uid,
          role: data.level,
          user: data.user,
        }));
        break;
      case ACTION_UPDATE_COLLABORATOR:
        dispatch(updateCollaborator({
          bundleId: workspace.bundleId,
          nodeId: workspace.nodeId,
          collaboratorId: data.collaborator.id,
          userId: data.collaborator.user_id,
          role: data.level,
        }));
        break;
      default:
        logging.warn('NOT_HANDLED_COLLABORATOR_DROP_ACTION: ', data);
    }
  })

  const handleRemove = useCallback((collaborator) => {
    if (userCapabilities.isOwner || useCallback.isAdmin) {
      dispatch(removeCollaborator({
        bundleId: workspace.bundleId,
        nodeId: workspace.nodeId,
        userId: collaborator.user_id,
      }))
    }
  })

  useEffect(() => {
    if (userCapabilities && userCapabilities.isOwner && !nodeState.collaboratorsOnceFetched) {
      dispatch(asyncFetchCollaborators({
        bundleId: workspace.bundleId,
        nodeId: workspace.nodeId,
      }))
    }
  }, [userCapabilities]);

  if (!nodeState || !nodeState.data) {
    return null;
  }

  return (
    <Block
      title={<TranslatableMessage message={intlMessages.collaborator} />}
    >
      {userCapabilities.canChangeEditPermission && (
        <div className="dz-EditPermissionPanel">
          <Tooltip
            placement="bottom"
            title={formatMessage(intlMessages.publicLabel)}
          >
            <SquareButton
              size="sm"
              className={classNames('dz-EditPermissionOption', {
                'is-selected': editPermission === EDIT_PERMISSION_PUBLIC,
              })}
              onClick={() =>
                updatePermission(EDIT_PERMISSION_PUBLIC)
              }
            >
              <SvgIcon icon="global" />
            </SquareButton>
          </Tooltip>
          <Tooltip
            placement="bottom"
            title={formatMessage(intlMessages.groupOnly)}
          >
            <SquareButton
              size="sm"
              className={classNames('dz-EditPermissionOption', {
                'is-selected': editPermission === EDIT_PERMISSION_GROUP,
              })}
              onClick={() =>
                updatePermission(EDIT_PERMISSION_GROUP)
              }
            >
              <SvgIcon icon="contact" />
            </SquareButton>
          </Tooltip>
        </div>
      )}
      <CollaboratorDropzone 
        level={ROLE_OWNER} 
        disabled
        icon={
          <span className='ft-SvgIcon' dangerouslySetInnerHTML={{ __html: ownerIcon }} />
        }
      >
        {owner && <Collaborator nodeWords={nodeWords} collaborator={owner} disabled />}
      </CollaboratorDropzone>

      <CollaboratorDropzone
        level={ROLE_ADMIN}
        handleDrop={handleDropzone}
        disabled={!userCapabilities.canAssignAdmin}
        icon={
          <span className='ft-SvgIcon' dangerouslySetInnerHTML={{ __html: adminIcon }} />
        }
      >
        {admins.map((c) => (
          <Collaborator 
            nodeWords={nodeWords} 
            onRemove={handleRemove} 
            key={c.id} 
            collaborator={c} 
            disabled={c.user && c.user.uid === currentUserId} 
          />
        ))}
      </CollaboratorDropzone>
      <CollaboratorDropzone
        level={ROLE_PARTICIPATOR}
        icon={
          <span className='ft-SvgIcon' dangerouslySetInnerHTML={{ __html: participatorIcon }} />
        }
        handleDrop={handleDropzone}
        disabled={!userCapabilities.canInviteCollaborator}
      >
        {participators.map((c) => (
          <Collaborator 
            nodeWords={nodeWords} 
            onRemove={handleRemove} 
            key={c.id} 
            collaborator={c} 
            disabled={c.user && c.user.uid === currentUserId} 
          />
        ))}
      </CollaboratorDropzone>

      {!!blocked.length && collaborators.isOwner && (
        <CollaboratorDropzone
          level={ROLE_BLOCKED}
          disabled
          icon={
            <span className='ft-SvgIcon' dangerouslySetInnerHTML={{ __html: blockedIcon }} />
          }
        >
          {blocked.map((c) => (
            <Collaborator 
              nodeWords={nodeWords} 
              key={c.id} 
              collaborator={c} 
            />
          ))}
        </CollaboratorDropzone>
      )}
    </Block>
  );
}

export default CollaboratorBlock;