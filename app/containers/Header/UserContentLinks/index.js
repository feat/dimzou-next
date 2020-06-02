/**
 *
 * UserContentLinks
 *
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Link from 'next/link';

import { getUsername } from '@/utils/user';
import { selectUserInfo, selectAvailableInfo } from '@/modules/user/selectors';
import { asyncFetchUserInfo } from '@/modules/user/actions';
import { selectCurrentUser } from '@/modules/auth/selectors';

import messages from '@/messages/menu';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

function UserContentLinks(props) {
  const { userId, activeLink } = props;
  const currentUser = useSelector(selectCurrentUser);
  const user = useSelector((state) => selectUserInfo(state, props));
  const availableInfo = useSelector((state) => selectAvailableInfo(state, props));
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      dispatch(asyncFetchUserInfo(props));
    }
  }, []);

  const isCurrentUser = currentUser && String(currentUser.uid) === userId;

  return (
    <div>
      {(isCurrentUser || availableInfo.has_file_x_event || availableInfo.has_dimzou_data) && (
        <Link
          href={{
            pathname: '/user-profile',
            query: { userId },
          }}
          as={`/profile/${userId}`}
        >
          <a
            className={classNames('ft-Menu__item', {
              'is-active': activeLink === 'home',
            })}
          >
            {user ? (
              getUsername(user.profile)
            ) : (
              <TranslatableMessage message={messages.home} />
            )}
          </a>
        </Link>
      )}
      {(isCurrentUser || availableInfo.has_file_x_event) && (
        <Link
          href={{
            pathname: '/user-filex',
            query: { userId },
          }}
          as={`/profile/${userId}/file-x`}
        >
          <a
            className={classNames('ft-Menu__item', {
              'is-active': activeLink === 'filex',
            })}
          >
            <TranslatableMessage message={messages.fileX} />
          </a>
        </Link>
      )}
      
      {(isCurrentUser || availableInfo.has_dimzou_data) && (
        <Link
          href={{
            pathname: '/',
            query: { userId },
          }}
          as={`/profile/${userId}/dimzou`}
        >
          <a
            className={classNames('ft-Menu__item', {
              'is-active': activeLink === 'dimzou',
            })}
          >
            <TranslatableMessage message={messages.dimzou} />
          </a>
        </Link>
      )}
      
      {isCurrentUser && (
        <Link
          href={{
            pathname: '/settings',
          }}
          as="/settings"
        >
          <a
            className={classNames('ft-Menu__item', {
              'is-active': activeLink === 'settings',
            })}
          >
            <TranslatableMessage message={messages.settings} />
          </a>
        </Link>
      )}
    </div>
  );
}

UserContentLinks.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  activeLink: PropTypes.oneOf(['home', 'filex', 'dimzou', 'settings']),
};

export default UserContentLinks;
