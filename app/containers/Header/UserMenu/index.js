import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Link from 'next/link';

import { getAvatar } from '@/utils/user';
import mMessages from '@/messages/menu';

import Menu from '@feat/feat-ui/lib/menu';
import Button from '@feat/feat-ui/lib/button';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import Avatar from '@feat/feat-ui/lib/avatar';
import { LogoutBlock } from '@/modules/auth/containers/LogoutButton';

import draft from '@/images/draft.svg';

function UserMenu(props) {
  const {
    user,
    intl: { formatMessage },
  } = props;

  useEffect(() => {
    // prefetch draft-creation
    import(/* webpackChunkName: "dimzou-edit" */ '@/modules/dimzou-edit');
  });

  return (
    <Menu className="HeaderUserMenu">
      <Link
        as="/draft/new"
        href={{
          pathname: '/dimzou-edit',
          query: {
            isCreate: true,
          },
        }}
      >
        <a
          className="ft-Menu__item ft-Menu__item_icon"
          data-track-anchor="New_Dimzou"
          data-anchor-type="UserMenu"
        >
          <button
            type="button"
            className="ft-IconButton ft-IconButton_default ft-IconButton_md"
            dangerouslySetInnerHTML={{ __html: draft }}
          />
          <span className="padding_l_5">
            {formatMessage(mMessages.newStory)}
          </span>
        </a>
      </Link>

      <Link
        href={{
          pathname: '/dimzou-edit',
          query: { userId: user.uid },
        }}
        as={`/profile/${user.uid}`}
      >
        <a
          className="ft-Menu__item ft-Menu__item_icon"
          data-track-anchor="UserProfile"
          data-anchor-type="UserMenu"
        >
          <IconButton size="md">
            <Avatar avatar={getAvatar(user, 'md')} size="xs" round />
          </IconButton>
          <span className="padding_l_5">
            {/* {formatMessage(mMessages.dashboard)} */}
            {user.username || user.uid}
          </span>
        </a>
      </Link>
      <LogoutBlock className='ft-Menu__item'>
        {formatMessage(mMessages.logout)}
      </LogoutBlock>
    </Menu>
  );
}

UserMenu.propTypes = {
  intl: PropTypes.object,
  user: PropTypes.object.isRequired,
};

export default injectIntl(UserMenu);
