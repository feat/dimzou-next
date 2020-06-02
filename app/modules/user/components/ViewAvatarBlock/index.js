import React from 'react';
import PropTypes from 'prop-types';

import LazyImage from '@feat/feat-ui/lib/lazy-image';
import ConsultButton from '@/modules/party/containers/ConsultButton';
import defaultAvatar from '@/images/default-avatar.png';
import './style.scss';

const ViewAvatarBlock = (props) => (
  <div className="ViewAvatarBlock">
    <LazyImage src={props.user.avatar || defaultAvatar} ratio={1} />
    <div className="ViewAvatarBlock__actions">
      <ConsultButton user={props.user} />
      {props.extraAction}
    </div>
  </div>
);

ViewAvatarBlock.propTypes = {
  avatar: PropTypes.string,
  user: PropTypes.object,
  extraAction: PropTypes.node,
};

export default ViewAvatarBlock;
