import React, { useMemo, useContext, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';

import Block from '@feat/feat-ui/lib/block';
import Tooltip from '@feat/feat-ui/lib/tooltip';
import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import intlMessages from '../../messages';
import CollaboratorDropzone from './CollaboratorDropzone';
import Collaborator from './Collaborator';
import Icon from '../Icon';

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

import {
  NodeContext,
  UserCapabilitiesContext,
  WorkspaceContext,
} from '../../context';

import './style.scss';

function CollaboratorBlock() {
  const { formatMessage } = useIntl();
  const nodeState = useContext(NodeContext);
  const userCapabilities = useContext(UserCapabilitiesContext);
  const workspace = useContext(WorkspaceContext);
  const dispatch = useDispatch();
  const collaborators =
    nodeState && nodeState.basic ? nodeState.basic.collaborators : [];
  const nodeWords = useMemo(
    () => collaborators.reduce((a, b) => a + b.contributing_words, 0),
    [collaborators],
  );
  const { owner, admins, participators, blocked } = useMemo(
    () => classifyCollaborators(collaborators),
    [collaborators],
  );
  const editPermission =
    nodeState && nodeState.basic ? nodeState.basic.permission : undefined;

  const updatePermission = useCallback((permission) => {
    if (editPermission === permission) {
      return;
    }
    dispatch(
      changeEditPermission({
        bundleId: workspace.bundleId,
        nodeId: workspace.nodeId,
        editPermission: permission,
      }),
    );
  });

  const handleDropzone = useCallback((data) => {
    switch (data.type) {
      case ACTION_ADD_COLLABORATOR:
        dispatch(
          addCollaborator({
            bundleId: workspace.bundleId,
            nodeId: workspace.nodeId,
            userId: data.userId,
            role: data.level,
          }),
        );
        break;
      case ACTION_UPDATE_COLLABORATOR:
        dispatch(
          updateCollaborator({
            bundleId: workspace.bundleId,
            nodeId: workspace.nodeId,
            collaboratorId: data.collaborator.id,
            userId: data.collaborator.user_id,
            role: data.level,
          }),
        );
        break;
      default:
        logging.warn('NOT_HANDLED_COLLABORATOR_DROP_ACTION: ', data);
    }
  });

  const handleRemove = useCallback((collaborator) => {
    dispatch(
      removeCollaborator({
        bundleId: workspace.bundleId,
        nodeId: workspace.nodeId,
        userId: collaborator.user_id,
      }),
    );
  }, []);

  useEffect(
    () => {
      if (
        userCapabilities &&
        userCapabilities.isOwner &&
        !nodeState.collaboratorsOnceFetched
      ) {
        dispatch(
          asyncFetchCollaborators({
            bundleId: workspace.bundleId,
            nodeId: workspace.nodeId,
          }),
        );
      }
    },
    [userCapabilities],
  );

  if (!nodeState || !nodeState.basic) {
    return null;
  }

  return (
    <Block
      title={<TranslatableMessage message={intlMessages.collaborator} />}
      noPadding
      style={{ paddingTop: 12 }}
    >
      {userCapabilities.canChangeEditPermission && (
        <div className="dz-EditPermissionPanel">
          <Tooltip
            placement="top"
            title={formatMessage(intlMessages.publicLabel)}
          >
            <ButtonBase
              className={classNames('dz-EditPermissionOption', 'size_sm', {
                'is-selected': editPermission === EDIT_PERMISSION_PUBLIC,
              })}
              onClick={() => updatePermission(EDIT_PERMISSION_PUBLIC)}
            >
              <Icon name="public" />
            </ButtonBase>
          </Tooltip>
          <Tooltip
            placement="top"
            title={formatMessage(intlMessages.groupOnly)}
          >
            <ButtonBase
              className={classNames('dz-EditPermissionOption', 'size_sm', {
                'is-selected': editPermission === EDIT_PERMISSION_GROUP,
              })}
              onClick={() => updatePermission(EDIT_PERMISSION_GROUP)}
            >
              <Icon name="group" />
            </ButtonBase>
          </Tooltip>
        </div>
      )}
      <CollaboratorDropzone
        level={ROLE_OWNER}
        disabled
        icon={<Icon name="roleOwner" />}
      >
        {owner && (
          <Collaborator nodeWords={nodeWords} collaborator={owner} disabled />
        )}
      </CollaboratorDropzone>

      <CollaboratorDropzone
        level={ROLE_ADMIN}
        handleDrop={handleDropzone}
        disabled={!userCapabilities.canAssignAdmin}
        icon={<Icon name="roleAdmin" />}
      >
        {admins.map((c) => (
          <Collaborator
            nodeWords={nodeWords}
            onRemove={handleRemove}
            canRemove={userCapabilities.isOwner}
            key={c.id}
            collaborator={c}
            disabled={!userCapabilities.isOwner} // only owner can assign role or remove collaborator
          />
        ))}
      </CollaboratorDropzone>
      <CollaboratorDropzone
        level={ROLE_PARTICIPATOR}
        icon={<Icon name="roleParticipator" />}
        handleDrop={handleDropzone}
        disabled={!userCapabilities.canInviteCollaborator}
      >
        {participators.map((c) => (
          <Collaborator
            nodeWords={nodeWords}
            onRemove={handleRemove}
            canRemove={userCapabilities.isOwner}
            key={c.id}
            collaborator={c}
            disabled={!userCapabilities.isOwner} // only owner can assign admin role or remove collaborator
          />
        ))}
      </CollaboratorDropzone>

      {!!blocked.length &&
        collaborators.isOwner && (
          <CollaboratorDropzone
            level={ROLE_BLOCKED}
            disabled
            icon={<Icon name="roleBlocked" />}
          >
            {blocked.map((c) => (
              <Collaborator
                nodeWords={nodeWords}
                canRemove={false}
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
