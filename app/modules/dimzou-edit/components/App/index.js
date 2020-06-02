import { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser } from '@/modules/auth/selectors'

import notification from '@feat/feat-ui/lib/notification';

import { formatMessage } from '@/services/intl'
import { getTemplate } from '../../utils/workspace';
import { WorkspaceContext } from '../../context';

import ChapterNodeCreation from '../ChapterNodeCreation';
import CoverNodeCreation from '../CoverNodeCreation';
import Draft from '../Draft';
import Publication from '../Publication';
import UserWorkspace from '../UserWorkspace';

import {
  createChapterPlaceholders,
  createPlaceholders,
  createCoverPlaceholders,
} from '../../messages';

import { asyncCreateBundle, exitCreateChapter, asyncCreateNode, exitCreateCover, resetWorkspaceCreation } from '../../actions';

import './style.scss';

function DimzouApp() {
  const workspace = useContext(WorkspaceContext);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetWorkspaceCreation());
  }, [workspace.bundleId, workspace.nodeId])

  if (workspace.isCoverCreationPanelOpened) {
    return (
      <div className="dz-App">
        <CoverNodeCreation
          cacheKey='dimzou-bundle.new'
          onSubmit={(data) => dispatch(asyncCreateBundle({
            ...data,
            isMultiChapter: true,
          })).catch((err) => {
            notification.error({
              message: 'Error',
              description: err.message,
            });
          })}
          onCancel={() => {
            dispatch(exitCreateCover())
          }}
          titlePlaceholder={formatMessage(createCoverPlaceholders.title)}
          summaryPlaceholder={formatMessage(createCoverPlaceholders.summary)}
        />
      </div>
    )
      
  } 
  
  if (workspace.isChapterCreationPanelOpened || workspace.isCreate) {
    return (
      <div className="dz-App">
        <ChapterNodeCreation
          currentUser={currentUser}
          defaultTemplate={getTemplate()}
          cacheKey={workspace.chapterCreationContext ? `dimzou-bundle.${workspace.chapterCreationContext.bundleId}.new-chapter` : `dimzou-bundle.new`}
          titlePlaceholder={workspace.chapterCreationContext ? formatMessage(createChapterPlaceholders.title) : formatMessage(createPlaceholders.title)}
          summaryPlaceholder={workspace.chapterCreationContext ? formatMessage(createChapterPlaceholders.summary) : formatMessage(createPlaceholders.summary)}
          contentPlaceholder={workspace.chapterCreationContext ? formatMessage(createChapterPlaceholders.content) : formatMessage(createPlaceholders.content)}
          canSelectTemplate
          canCancel={!workspace.isCreate}
          onCancel={() => dispatch(exitCreateChapter({ bundleId: workspace.bundleId }))}
          onSubmit={(data) => {
            if (workspace.chapterCreationContext) {
              return dispatch(asyncCreateNode({
                bundleId: workspace.chapterCreationContext.bundleId,
                data,
              }))
            } 
            return dispatch(asyncCreateBundle(data))
          }}
        />
      </div>
    )
  }  

  if (workspace.userId) {
    return (
      <div className='dz-App'>
        <UserWorkspace userId={workspace.userId} />
      </div>
    )
  }

  // if (workspace.targetUserId) {
  //   return (
  //     <div className='dz-App'>
  //       <BundleRender
  //         sidebarFirst={<AppSidebarFirst userId={workspace.targetUserId} />}
  //         main={<SplashView />}
  //       />
  //     </div>
  //   )
  // }
  if (workspace.isPublicationView) {
    return (
      <div className="dz-App">
        <Publication />
      </div>
    )
  }

  return (
    <div className='dz-App'>
      <Draft />
    </div>
  )
}

export default DimzouApp;