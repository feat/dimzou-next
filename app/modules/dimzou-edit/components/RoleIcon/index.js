// import React from 'react';
import { ROLE_OWNER, ROLE_ADMIN, ROLE_PARTICIPATOR } from '../../constants';
import Icon from '../Icon';

function RoleIcon({ role }) {
  if (!role) {
    return null;
  }
  if (role === ROLE_OWNER) {
    return <Icon className="size_16" name="roleOwner" />;
  }
  if (role === ROLE_ADMIN) {
    return <Icon className="size_16" name="roleAdmin" />;
  }
  if (role === ROLE_PARTICIPATOR) {
    return <Icon className="size_16" name="roleParticipator" />;
  }
}

export default RoleIcon;
