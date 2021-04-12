import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectUser } from '@/modules/user/selectors';

import Head from 'next/head';
import { getUsername } from '@/modules/user/utils';
import { concatHeaders } from '@/utils/router';

import { OwnerContext } from '../../context';
import WorkshopContextProvider from '../../providers/WorkshopContextProvider';

import { BaseRender } from '../AppRenders';
import ResourceNavigator from './ResourceNavigator';
import Landing from './Landing';
import Detail from './Detail';

import './style.scss';

function Dashboard(props) {
  const user = useSelector((state) => selectUser(state, props));

  const { type = 'landing' } = props;

  let main;
  switch (type) {
    case 'landing':
      main = <Landing {...props} />;
      break;
    case 'detail':
      main = <Detail {...props} />;
      break;
    default:
      main = <div>Unknown props: {JSON.stringify(props)} </div>;
      break;
  }

  return (
    <OwnerContext.Provider value={user || { uid: props.userId }}>
      <WorkshopContextProvider>
        <Head>
          <title>
            {concatHeaders(getUsername(user || { uid: props.userId }))}
          </title>
        </Head>
        <BaseRender
          sidebarFirst={<ResourceNavigator {...props} />}
          main={main}
          sidebarSecondClassName="dz-App__sidebarSecond_ads"
        />
      </WorkshopContextProvider>
    </OwnerContext.Provider>
  );
}

Dashboard.propTypes = {
  type: PropTypes.string,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Dashboard;
