import {
  ROLE_OWNER,
  ROLE_ADMIN,
  ROLE_PARTICIPATOR,
  EDIT_PERMISSION_PUBLIC,
} from '../constants';

export const getUserRole = (userId, collaborators = [], editPermission) => {
  const member = collaborators.find((m) => m.user_id === userId);
  if (!member && editPermission === EDIT_PERMISSION_PUBLIC) {
    return ROLE_PARTICIPATOR;
  }
  return member && member.role;
};

export const isOwner = (userId, collaborators = [], editPermission) => {
  const role = getUserRole(userId, collaborators, editPermission);
  return role === ROLE_OWNER;
};

export const isAdmin = (userId, collaborators = [], editPermission) => {
  const role = getUserRole(userId, collaborators, editPermission);
  return role === ROLE_ADMIN;
};

export const isParticipator = (userId, collaborators = [], editPermission) => {
  const role = getUserRole(userId, collaborators, editPermission);
  return role === ROLE_PARTICIPATOR;
};

export const classifyCollaborators = (collaborators = []) => {
  let owner;
  const blocked = [];
  const admins = [];
  const participators = [];

  for (let i = 0; i < collaborators.length; i += 1) {
    const c = collaborators[i];
    if (c.is_deleted) {
      blocked.push(c);
    } else if (c.role === ROLE_OWNER) {
      owner = c;
    } else if (c.role === ROLE_ADMIN) {
      admins.push(c);
    } else if (c.role === ROLE_PARTICIPATOR) {
      participators.push(c);
    }
  }
  return {
    owner,
    admins,
    participators,
    blocked,
  }
};
