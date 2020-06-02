// import React from 'react';
import { ROLE_OWNER, ROLE_ADMIN, ROLE_PARTICIPATOR } from '../../constants';

function RoleIcon({ role }) {
  if (!role) {
    return null;
  }
  if (role === ROLE_OWNER) {
    return '\u265A';
  }
  if (role === ROLE_ADMIN) {
    return '\u265D';
  }
  if (role === ROLE_PARTICIPATOR) {
    return '\u265E';
  }
}

export default RoleIcon;