import React, { useContext } from 'react';
import { UserInfo } from '../../UserInfoProvider';
import { getUsername } from '@/utils/user'

function Username() {
  const userContext = useContext(UserInfo);
  if (userContext.data) {
    return <span>{getUsername(userContext.data.profile)}</span>
  }
  return <div>...</div>
}

export default Username;
