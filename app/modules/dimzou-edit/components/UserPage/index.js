import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import Head from 'next/head';
import { getUsername } from '@/modules/user/utils';
import { concatHeaders } from '@/utils/router';

import { selectUser } from '@/modules/user/selectors';
import UserDimzouList from '@/modules/dimzou-user-list/containers/UserDimzouList';
import { OwnerContext } from '../../context';
import WorkshopNavigator from '../WorkshopNavigator';
import { BaseRender } from '../AppRenders';
import WorkshopContextProvider from '../../providers/WorkshopContextProvider';
import { getAsPath } from '../../utils/router';

function UserPage(props) {
  const user = useSelector((state) => selectUser(state, props));

  return (
    <OwnerContext.Provider value={user || { uid: props.userId }}>
      <WorkshopContextProvider>
        <Head>
          <title>
            {concatHeaders(getUsername(user || { uid: props.userId }))}
          </title>
        </Head>
        <BaseRender
          sidebarFirst={<WorkshopNavigator />}
          main={
            <UserDimzouList
              userId={props.userId}
              onItemClick={(item) => {
                const href = {
                  pathname: '/dimzou-edit',
                  query: {
                    pageName: item.isDraft ? 'draft' : 'view',
                    bundleId: item.id,
                  },
                };
                const asPath = getAsPath(href);
                Router.push(href, asPath).then(() => {
                  window.scrollTo(0, 0);
                });
              }}
            />
          }
        />
      </WorkshopContextProvider>
    </OwnerContext.Provider>
  );
}

UserPage.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default UserPage;
