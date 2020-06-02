import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';


import Button from '@feat/feat-ui/lib/button';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import DragDropBoard from '@/components/DragDropBoard';
import { selectCurrentUser } from '@/modules/auth/selectors';

import DimzouEditorToolbar from '../DimzouEditorToolbar';
import TemplateSwitchButton from '../TemplateSwitchButton';
import intlMessages, { menu as menuMessages } from '../../messages';
import { getActiveHeading } from '../../utils/node';
import { getConfirmedText } from '../../utils/content';


import { selectActiveCompoState } from '../../selectors';
import {
  // initCreateChapter,
  // exitCreateChapter,
  initRelease,
  changeTemplate,
  updateBlockEditor,
  updateRewordingEditor,
  updateAppendBlock,
  exitCreateChapter,
  initCreateChapter,
  exitCreateCover,
  initCreateCover,
  asyncCreateCopyBundle,
  initSectionRelease,
} from '../../actions';


import { 
  BundleContext, 
  NodeContext, 
  WorkspaceContext, 
  UserCapabilitiesContext, 
  ScrollContext,
} from '../../context'

import { getTemplate } from '../../utils/workspace';
import pageIcon from '../../assets/icon-page.svg';
import bookIcon from '../../assets/icon-book.svg';
import copyIcon from '../../assets/icon-page-copy.svg';
import releaseIcon from '../../assets/icon-release.svg';
import { BUNDLE_STATUS_PUBLISHED } from '../../constants';
import './style.scss';

function Docker(props) {
  const bundleState = useContext(BundleContext)
  const nodeState = useContext(NodeContext)
  const workspace = useContext(WorkspaceContext)
  const userCapabilities = useContext(UserCapabilitiesContext);
  const scrollContext = useContext(ScrollContext);
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const activeCompoKey = nodeState ? nodeState.activeCompoKey : undefined;
  const activeCompo = useSelector((state) => selectActiveCompoState(state, {
    activeCompoKey,
  }));

  const compoData = activeCompo || {};
  const compoKey = activeCompoKey || '';
  const [type] = compoKey.split('.');
  const structure = type === 'appendings' ? 'content' : compoData.structure;

  const handleEditor = useCallback((editorState) => {
    const { bundleId, nodeId } = workspace;
    switch (type) {
      case 'dimzouBlocks':
        dispatch(
          updateBlockEditor({
            bundleId,
            nodeId,
            blockId: activeCompo.blockId,
            structure: activeCompo.structure,
            editorState,
          })
        )
        break;
      case 'rewordings':
        dispatch(
          updateRewordingEditor({
            bundleId,
            nodeId,
            rewordingId: activeCompo.rewordingId,
            editorState,
          })
        )
        break;
      case 'appendings':
        dispatch(
          updateAppendBlock({
            bundleId: activeCompo.bundleId,
            nodeId: activeCompo.nodeId,
            pivotId: activeCompo.pivotId,
            editorState,
          }));
        break;
      default:
        logging.debug('Unknown type :', type);
    }
  }, [activeCompoKey]);
  
  const editorToolbar =  (
    <DimzouEditorToolbar
      structure={structure}
      className="dz-EditDocker__section"
      editorState={compoData.editorState}
      onChange={handleEditor}
      mode={compoData.editorMode}
    />
  );
  
  const actionButtons = [];
  // if (userCapabilities.canCreateChapter) {
  //   const toggleChapterCreation = () => {
  //     if (workspace.isChapterCreationPanelOpened) {
  //       dispatch(exitCreateChapter({
  //         bundleId: workspace.bundleId,
  //       }))
  //     } else {
  //       dispatch(initCreateChapter({
  //         bundleId: workspace.bundleId,
  //       }))
  //     }
  //   }
  //   actionButtons.push(
  //     <Button
  //       type="merge"
  //       size="md"
  //       className={classNames('dz-DockerButton', {
  //         'is-selected': workspace.isChapterCreationPanelOpened,
  //       })}
  //       onClick={toggleChapterCreation}
  //       key='creation'
  //     >
  //       <SvgIcon icon="add-part" />
  //       <TranslatableMessage message={intlMessages.newChapter} />
  //     </Button>
  //   )
  // }

  if (userCapabilities.canChangeTemplate) {
    actionButtons.push(
      <TemplateSwitchButton 
        className="dz-DockerButton"
        key='template'
        initialValue={getTemplate(nodeState)}
        onChange={(value) => {
          dispatch(changeTemplate({
            bundleId: workspace.bundleId,
            nodeId: workspace.nodeId,
            template: value,
          }))
        }}
      />
    )
  }
  if (userCapabilities.canPublish) {
    actionButtons.push(
      <Button
        key='release'
        type="merge"
        className={classNames('dz-DockerButton', {
          'is-selected': workspace.isReleasePanelOpened,
        })}
        onClick={() => {
          const bundle = bundleState.data;
          // section release
          const activeHeading = getActiveHeading(scrollContext.activeHash, nodeState.outline);
          if (activeHeading) {
            dispatch(initSectionRelease({
              bundleId: nodeState.data.bundle_id,
              nodeId: nodeState.data.id,
              titleId: activeHeading.id,
              title:`<h1>${getConfirmedText(activeHeading.current.html_content)}</h1>`,
              category: bundle.category,
              applyScenes: bundle.apply_scenes ? bundle.apply_scenes.map((item) => ({
                value: item,
                label: item,
              })) : null,
            }))
          } else {
            dispatch(initRelease({
              bundle,
              nodes: bundle.nodes,
              step: bundle.category ? 'review' : 'category',
              initialValues: {
                category: bundle.category,
                applyScenes: bundle.apply_scenes ? bundle.apply_scenes.map((item) => ({
                  value: item,
                  label: item,
                })) : null,
              },
            }))
          }
        }}
      >
        <span className="ft-SvgIcon" dangerouslySetInnerHTML={{ __html: releaseIcon }} />
        <TranslatableMessage message={intlMessages.releaseLabel} />
      </Button>
    )
  }

  if (currentUser && currentUser.uid) {
    actionButtons.push(
      <Button
        key="new-chapter"
        type="merge"
        className={classNames('dz-DockerButton', {
          'is-selected': workspace.isChapterCreationPanelOpened,
        })}
        onClick={() => {
          if (workspace.isChapterCreationPanelOpened) {
            dispatch(exitCreateChapter());
          } else {
            dispatch(initCreateChapter());
          }
        }}
      >
        <span className="ft-SvgIcon" dangerouslySetInnerHTML={{ __html: pageIcon }} />
        <TranslatableMessage message={menuMessages.createPage} />
      </Button>
    )
    actionButtons.push(
      <Button
        key="new-cover"
        type="merge"
        className={classNames('dz-DockerButton', {
          'is-selected': workspace.isCoverCreationPanelOpened,
        })}
        onClick={() => {
          if (workspace.isCoverCreationPanelOpened) {
            dispatch(exitCreateCover());
          } else {
            dispatch(initCreateCover());
          }
        }}
      >
        <span className="ft-SvgIcon" dangerouslySetInnerHTML={{ __html: bookIcon }} />
        <TranslatableMessage message={menuMessages.createCover} />
      </Button>
    )
    if (bundleState && bundleState.data && bundleState.data.status === BUNDLE_STATUS_PUBLISHED) {
      actionButtons.push(
        <Button
          key="new-copy"
          type="merge"
          className={classNames('dz-DockerButton', {
            'is-selected': workspace.isCoverCreationPanelOpened,
          })}
          onClick={() => {
            dispatch(asyncCreateCopyBundle({
              bundleId: workspace.bundleId,
            }))
          }}
        >
          <span className="ft-SvgIcon" dangerouslySetInnerHTML={{ __html: copyIcon }} />
          <TranslatableMessage message={menuMessages.createCopy} />
        </Button>
      )
    }
  }

  return (
    <DragDropBoard>
      <div className={classNames('dz-EditDockerWrap', props.className)}>
        <div className="dz-EditDocker">
          {editorToolbar}
          {!!actionButtons.length && (
            <div className="dz-EditDocker__section">
              {actionButtons}
            </div>
          )}
        </div>
      </div>
    </DragDropBoard>
  )
}

Docker.propTypes = {
  className: PropTypes.string,
}

export default Docker;