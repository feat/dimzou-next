import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import SplashView from '@/components/SplashView';
import Router from 'next/router'
import NodeEdit from '../NodeEdit';
// import BundleEdit from '../BundleEdit';
import ReleaseModal from '../ReleaseModal';
import InvitationModal from '../InvitationModal';
import SectionReleasePanel from '../SectionReleasePanel';
import { getChapterRender } from '../AppRenders';

import AppSidebarFirst from '../AppSidebarFirst';
import NodeContextProvider from '../../providers/NodeContextProvider';
import UserCapabilitiesProvider from '../../providers/UserCapabilitiesProvider';

import { initBundle } from '../../actions'
import { WorkspaceContext, BundleContext, OwnerContext } from '../../context'
import { selectBundleState } from '../../selectors'
import { getOwner, getTemplate }  from '../../utils/workspace';

function Draft() {
  const workspace = useContext(WorkspaceContext);
  const bundleState = useSelector((state) => selectBundleState(state, workspace));
  const dispatch = useDispatch();
  const template = getTemplate();
  const Render = getChapterRender(template);

  useEffect(() => {
    if (!workspace.bundleId) {
      return;
    }
    if (workspace.bundleId && !bundleState) {
      dispatch(initBundle({
        bundleId: workspace.bundleId,
        nodeId: workspace.nodeId,
        invitationCode: workspace.invitationCode,
      }))
    }
  }, [workspace.bundleId]);

  useEffect(() => {
    if (!workspace.bundleId) {
      return;
    }
    if (!workspace.nodeId && bundleState && bundleState.data) {
      const nodeId = bundleState.data.nodes[0].id;
      Router.replace({
        pathname: Router.pathname,
        query: {
          ...Router.query,
          nodeId,
        },
      }, `/draft/${workspace.bundleId}/${nodeId}`)
    }
  }, [bundleState, workspace.bundleId, workspace.nodeId])

  if (bundleState && bundleState.fetchError) {
    return (
      <Render
        main={
          <div style={{ paddingTop: 56, paddingBottom: 56 }}>{bundleState.fetchError.message}</div>
        }
        sidebarFirst={(
          <AppSidebarFirst />
        )}
      />
    )
  }

  if (!bundleState || !bundleState.data) {
    return (
      <Render 
        sidebarFirst={<AppSidebarFirst />}
        main={<SplashView />}
      />
    )
  }
  // const isMultiChapter = bundleState.data.is_multi_chapter;

  return (
    <BundleContext.Provider value={bundleState}>
      <OwnerContext.Provider value={getOwner(bundleState.data)}>
        <NodeContextProvider bundleId={workspace.bundleId} nodeId={workspace.nodeId}>
          <UserCapabilitiesProvider>
            <NodeEdit />
            {/* {isMultiChapter ? <BundleEdit /> : <NodeEdit />} */}
            <ReleaseModal />
            <InvitationModal />
            <SectionReleasePanel />
          </UserCapabilitiesProvider>
        </NodeContextProvider>
      </OwnerContext.Provider>
    </BundleContext.Provider>
  )
}

export default Draft;