import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { userFromProfile } from '@/utils/user';
import { UserInfo } from '../../UserInfoProvider';
import ViewAvatarBlock from '../ViewAvatarBlock';
import ViewBasicInfoBlock from '../ViewBasicInfoBlock';
import ViewLanguagesBlock from '../ViewLanguagesBlock';


function UserInfoBlock(props) {
  const { data } = useContext(UserInfo);
  if (!data) {
    return null;
  }
  return (
    <div className="b-UserInfo">
      <ViewAvatarBlock 
        user={userFromProfile(data.profile)} 
        extraAction={props.extraAction}
      />
      <ViewBasicInfoBlock data={data.profile} statistics={data.statistics} dimzouScores={data.dimzouScores} />
      <ViewLanguagesBlock data={data.languages} />
    </div>
  )
}

UserInfoBlock.propTypes = {
  extraAction: PropTypes.node,
}

export default UserInfoBlock;
