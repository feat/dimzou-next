import React, { useContext, useMemo } from 'react'
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/modules/auth/selectors';
import { COMMENTABLE_TYPE_PUBLICATION } from '@/modules/comment/constants';

import CommentBundle from '@/modules/comment/containers/CommentBundle';
import SplashView from '@/components/SplashView';

import { PublicationContext }  from '../../context';
import { getTemplate } from '../../utils/workspace';
import { getChapterRender } from '../AppRenders';
import AppSidebarFirst from '../AppSidebarFirst';
import PublicationTitle from './PublicationTitle';
import PublicationSummary from './PublicationSummary';
import PublicationContent from './PublicationContent';
import PublicationCover from './PublicationCover';
import PublicationDocker from './PublicationDocker';

function ArticleRender() {
  const publicationState = useContext(PublicationContext);
  const currentUser = useSelector(selectCurrentUser);

  const template = getTemplate(publicationState);
  const Render = getChapterRender(template);

  const capabilities = useMemo(() => ({
    canComment: publicationState && publicationState.data && publicationState.data.author
        && publicationState.data.author.uid !== currentUser.uid,
    maxReplyLimit: 1,
    commentLimit: 1,
  }), [publicationState, currentUser]);

  if (!publicationState || !publicationState.data) {
    return (
      <Render 
        sidebarFirst={<AppSidebarFirst />}
        content={<SplashView />}
      />
    )
  }

  const { data: publication } = publicationState;
  
  return (
    <Render 
      sidebarFirst={<AppSidebarFirst />}
      cover={<PublicationCover />}
      title={
        <PublicationTitle />
      }
      summary={<PublicationSummary />}
      content={
          <>
            <div style={{ marginTop: 48, minHeight: '80vh'}}>
              <PublicationContent />
            </div>
            <CommentBundle
              autoFocus
              entityCapabilities={capabilities}
              entityType={COMMENTABLE_TYPE_PUBLICATION}
              entityId={publication.id}
              instanceKey={`dimzou-edit.publication.${publication.id}`}
              initialData={publication.comments}
              initialRootCount={publication.comments_count}
              channel={`activity-comment-publication-${publication.id}`}
              wrapper={(state, content) => {
                if (
                  state &&
                    state.isInitialized &&
                    !capabilities.canComment &&
                    state.rootCount === 0
                ) {
                  return null;
                }
                return (
                  <div className="dz-ViewWork__section dz-ViewWork__comment">
                    {content}
                  </div>
                );
              }}
            />
            <PublicationDocker />
          </>
      }
    />
  )
}

export default ArticleRender;