import React, { useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router'

import SplashView from '@/components/SplashView';
import AppSidebarFirst from '../AppSidebarFirst';
import { getChapterRender } from '../AppRenders';
import { WorkspaceContext, PublicationBundleContext, OwnerContext } from '../../context';
import { getOwner, getTemplate }  from '../../utils/workspace';
import { selectPublicationBundleState } from '../../selectors'
import { asyncFetchBundleDesc } from '../../actions';
import PublicationContextProvider from '../../providers/PublicationContextProvider';
// import BookRender from './BookRender';
import ArticleRender from './ArticleRender';
import { getAsPath } from '../../utils/router';

function Publication() {
  const workspace = useContext(WorkspaceContext);
  // publication bundle state
  const pBundleState = useSelector((state) => selectPublicationBundleState(state, workspace));
  const dispatch = useDispatch();
  const template = getTemplate();
  const Render = getChapterRender(template);

  useEffect(() => {
    if (!pBundleState) {
      dispatch(asyncFetchBundleDesc({
        bundleId: workspace.bundleId,
        nodeId: workspace.nodeId,
      }))
    }
  }, [workspace.bundleId]);

  useEffect(() => {
    if (!workspace.bundleId) {
      return;
    }
    if (!workspace.nodeId && pBundleState && pBundleState.data) {
      const nodeId = pBundleState.data.nodes[0].id;
      const href = {
        pathname: Router.pathname,
        query: {
          ...Router.query,
          nodeId,
        },
      }
      const asPath = getAsPath(href);
      Router.replace(href, asPath)
    }
  }, [pBundleState, workspace.bundleId, workspace.nodeId])
  if (pBundleState && pBundleState.fetchError) {
    return (
      <Render
        content={
          <div style={{ paddingTop: 56, paddingBottom: 56 }}>{pBundleState.fetchError.message || pBundleState.fetchError.code}</div>
        }
        sidebarFirst={(
          <AppSidebarFirst />
        )}
      />
    )
  }

  if (!pBundleState || !pBundleState.data) {
    return (
      <Render 
        sidebarFirst={<AppSidebarFirst />}
        content={<SplashView />}
      />      
    )
  }

  const ContentRender = ArticleRender;
  // const isMultiChapter = pBundleState.data.is_multi_chapter;
  // // const ContentRender = isMultiChapter ? BookRender : ArticleRender;
  const ownerUser = getOwner(pBundleState.data);
  return (
    <PublicationBundleContext.Provider value={pBundleState}>
      <OwnerContext.Provider value={ownerUser}>
        <PublicationContextProvider bundleId={workspace.bundleId} nodeId={workspace.nodeId}>
          <ContentRender />
        </PublicationContextProvider>
      </OwnerContext.Provider>
    </PublicationBundleContext.Provider>
  )
}

export default Publication;