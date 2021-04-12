/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Link from 'next/link';
import notification from '@feat/feat-ui/lib/notification';

import { getUsername } from '@/modules/user/utils';
import mMessages from '@/messages/menu';
import { asyncLogout } from '@/modules/auth/actions';

import Menu from '@feat/feat-ui/lib/menu';
import { useDispatch } from 'react-redux';

function UserMenu(props) {
  const dispatch = useDispatch();
  const {
    user,
    intl: { formatMessage },
  } = props;

  return (
    <Menu className="HeaderUserMenu">
      <Link
        as="/draft/new"
        href={{
          pathname: '/dimzou-edit',
          query: {
            pageName: 'create',
          },
        }}
      >
        <a
          className="ft-Menu__item"
          data-track-anchor="New_Dimzou"
          data-anchor-type="UserMenu"
        >
          <span className="">{formatMessage(mMessages.newStory)}</span>
        </a>
      </Link>

      <Link
        href={{
          pathname: '/user-profile',
          query: { userId: user.uid },
        }}
        as={`/profile/${user.uid}`}
      >
        <a
          className="ft-Menu__item"
          data-track-anchor="UserProfile"
          data-anchor-type="UserMenu"
        >
          <span className="">
            {/* {formatMessage(mMessages.dashboard)} */}
            {getUsername(user)}
          </span>
        </a>
      </Link>
      <a
        href="#"
        className="ft-Menu__item"
        onClick={(e) => {
          e.preventDefault();
          dispatch(asyncLogout())
            .then(() => {
              window.location.reload();
            })
            .catch((err) => {
              logging.error(err);
              notification.error({
                message: 'Error',
                description: err.message,
              });
            });
        }}
      >
        {formatMessage(mMessages.logout)}
      </a>
    </Menu>
  );
}

UserMenu.propTypes = {
  intl: PropTypes.object,
  user: PropTypes.object.isRequired,
};

export default injectIntl(UserMenu);
