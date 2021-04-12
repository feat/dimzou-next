import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';

import SplashView from '@/components/SplashView';
import BackButton from '@/components/BackButton';
import WorkshopNavigator from '../WorkshopNavigator';
import { getChapterRender } from '../AppRenders';
import { PublicationBundleContext, OwnerContext } from '../../context';
import { getOwner, getTemplate } from '../../utils/workspace';
import { selectPublicationBundleState } from '../../selectors';
import { asyncFetchBundleDesc } from '../../actions';
import WorkshopContextProvider from '../../providers/WorkshopContextProvider';
import PublicationContextProvider from '../../providers/PublicationContextProvider';
import ScrollContextProvider from '../../providers/ScrollContextProvider';
// import BookRender from './BookRender';
import ArticleRender from './ArticleRender';
import { getAsPath } from '../../utils/router';

function Publication(props) {
  // publication bundle state
  const pBundleState = useSelector((state) =>
    selectPublicationBundleState(state, props),
  );
  const dispatch = useDispatch();
  const template = getTemplate();
  const Render = getChapterRender(template);

  useEffect(
    () => {
      if (!pBundleState) {
        dispatch(
          asyncFetchBundleDesc({
            bundleId: props.bundleId,
            nodeId: props.nodeId,
          }),
        );
      }
    },
    [props.bundleId],
  );

  useEffect(
    () => {
      if (!props.bundleId) {
        return;
      }
      if (!props.nodeId && pBundleState && pBundleState.data) {
        const nodeId = pBundleState.data.nodes[0].id;
        const href = {
          pathname: Router.pathname,
          query: {
            ...Router.query,
            nodeId,
          },
        };
        const asPath = getAsPath(href);
        Router.replace(href, asPath);
      }
    },
    [pBundleState, props.bundleId, props.nodeId],
  );
  if (pBundleState && pBundleState.fetchError) {
    return (
      <WorkshopContextProvider>
        <Render
          content={
            <div style={{ paddingTop: 56, paddingBottom: 56 }}>
              {pBundleState.fetchError.message || pBundleState.fetchError.code}
            </div>
          }
          sidebarFirst={<WorkshopNavigator />}
        />
      </WorkshopContextProvider>
    );
  }

  if (!pBundleState || !pBundleState.data) {
    return (
      <WorkshopContextProvider>
        <Render sidebarFirst={<WorkshopNavigator />} content={<SplashView />} />
      </WorkshopContextProvider>
    );
  }

  const ContentRender = ArticleRender;
  // const isMultiChapter = pBundleState.data.is_multi_chapter;
  // // const ContentRender = isMultiChapter ? BookRender : ArticleRender;
  const ownerUser = getOwner(pBundleState.data);
  return (
    <PublicationBundleContext.Provider value={pBundleState}>
      <OwnerContext.Provider value={ownerUser}>
        <WorkshopContextProvider>
          <ScrollContextProvider>
            <PublicationContextProvider
              bundleId={props.bundleId}
              nodeId={props.nodeId}
            >
              <>
                <ContentRender />
                <BackButton />
              </>
            </PublicationContextProvider>
          </ScrollContextProvider>
        </WorkshopContextProvider>
      </OwnerContext.Provider>
    </PublicationBundleContext.Provider>
  );
}

Publication.propTypes = {
  bundleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nodeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Publication;
