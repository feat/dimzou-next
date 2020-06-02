import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux';
import Router from 'next/router';
import { selectCurrentUser } from '@/modules/auth/selectors';
import { selectUser } from '@/modules/user/selectors';
import UserDimzouList from '@/modules/dimzou-view/containers/UserDimzouList';
import { OwnerContext } from '../../context'
import AppSidebarFirst from '../AppSidebarFirst';
import { BaseRender } from '../AppRenders';
import Dashboard from '../Dashboard';
import { getAsPath } from '../../utils/router';

function UserWorkspace(props) {
  const user = useSelector((state) => selectUser(state, props));
  const currentUser = useSelector(selectCurrentUser);

  const uid = parseInt(props.userId, 10 );
  const main  = uid === currentUser.uid ? <Dashboard userId={uid} /> : (
    <div style={{ paddingTop: 112, paddingBottom: 8 }}>
      <UserDimzouList 
        userId={uid} 
        onItemClick={(item) => {
          const href = {
            pathname: '/dimzou-edit',
            query: {
              bundleId: item.id,
              isPublicationView: !item.isDraft,
            },
          };
          const asPath = getAsPath(href)
          Router.push(href, asPath).then(() => {
            window.scrollTo(0, 0);
          });
        }}
      />
    </div>
  )

  return (
    <OwnerContext.Provider value={user || { uid }}>
      <BaseRender 
        sidebarFirst={<AppSidebarFirst />}
        main={main}
      />
    </OwnerContext.Provider>
  )

}

UserWorkspace.propTypes = {
  userId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
}

export default UserWorkspace;