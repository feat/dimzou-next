import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Router from 'next/router';
import get from 'lodash/get';

import SplashView from '@/components/SplashView';
import { initBundle } from '../actions';
import { WorkspaceContext, BundleContext, OwnerContext } from '../context';
import { selectBundleState } from '../selectors';
import { getOwner, getTemplate } from '../utils/workspace';
import WorkshopNavigator from '../components/WorkshopNavigator';
import WorkshopContextProvider from './WorkshopContextProvider';
import { getChapterRender } from '../components/AppRenders';

// TODO: handle draft view and publication view.
function BundleContextProvider(props) {
  const workspace = useContext(WorkspaceContext);
  const bundleState = useSelector((state) =>
    selectBundleState(state, workspace),
  );
  const dispatch = useDispatch();

  useEffect(
    () => {
      // console.log('bundle init effect');
      if (!workspace.bundleId) {
        return;
      }
      if (workspace.bundleId && !bundleState) {
        dispatch(
          initBundle({
            bundleId: workspace.bundleId,
            nodeId: workspace.nodeId,
            invitationCode: workspace.invitationCode,
          }),
        );
      }
    },
    [workspace.bundleId],
  );

  useEffect(
    () => {
      if (!workspace.bundleId) {
        return;
      }
      if (!workspace.nodeId && bundleState && bundleState.data) {
        const nodeId = get(bundleState, 'data.nodes[0].id');
        if (nodeId) {
          Router.replace(
            {
              pathname: Router.pathname,
              query: {
                ...Router.query,
                nodeId,
              },
            },
            `/draft/${workspace.bundleId}/${nodeId}`,
          );
        } else {
          logging.warn(
            'FAILED_TO_GET_NODE_ID_FROM_BUNDLE_DATA',
            bundleState.data,
          );
        }
      }
    },
    [bundleState, workspace.bundleId, workspace.nodeId],
  );

  const template = getTemplate();
  const Render = getChapterRender(template);
  if (bundleState && bundleState.fetchError) {
    return (
      <BundleContext.Provider value={bundleState}>
        <WorkshopContextProvider>
          <Render
            content={
              <div style={{ paddingTop: 56, paddingBottom: 56 }}>
                {bundleState.fetchError.message}
              </div>
            }
            sidebarFirst={<WorkshopNavigator />}
          />
        </WorkshopContextProvider>
      </BundleContext.Provider>
    );
  }

  if (!bundleState || !bundleState.data) {
    return (
      <BundleContext.Provider value={bundleState}>
        <WorkshopContextProvider>
          <Render
            sidebarFirst={<WorkshopNavigator />}
            content={<SplashView />}
          />
        </WorkshopContextProvider>
      </BundleContext.Provider>
    );
  }

  return (
    <BundleContext.Provider value={bundleState}>
      <OwnerContext.Provider value={getOwner(bundleState.data)}>
        <WorkshopContextProvider>{props.children}</WorkshopContextProvider>
      </OwnerContext.Provider>
    </BundleContext.Provider>
  );
}

BundleContextProvider.propTypes = {
  children: PropTypes.node,
};

export default BundleContextProvider;
