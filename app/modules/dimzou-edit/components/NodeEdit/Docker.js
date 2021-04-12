import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import invariant from 'invariant';

import { getActiveHeading } from '../../utils/node';
import { getAsPath } from '../../utils/router';

import { selectActiveCompoState } from '../../selectors';
import {
  // initCreateChapter,
  // exitCreateChapter,
  initRelease,
  changeTemplate,
  updateBlockEditor,
  updateRewordingEditor,
  updateAppendBlock,
  asyncCreateCopyBundle,
  initSectionRelease,
} from '../../actions';

import {
  BundleContext,
  NodeContext,
  WorkspaceContext,
  UserCapabilitiesContext,
  ScrollContext,
} from '../../context';

import { getTemplate } from '../../utils/workspace';
import { BUNDLE_STATUS_PUBLISHED } from '../../constants';

import DraftDocker from '../DraftDocker';

function Docker(props) {
  const bundleState = useContext(BundleContext);
  const nodeState = useContext(NodeContext);
  const workspace = useContext(WorkspaceContext);
  const userCapabilities = useContext(UserCapabilitiesContext);
  const scrollContext = useContext(ScrollContext);
  const dispatch = useDispatch();
  const activeCompoKey = nodeState ? nodeState.activeCompoKey : undefined;
  const activeCompo = useSelector((state) =>
    selectActiveCompoState(state, {
      activeCompoKey,
    }),
  );

  const compoData = activeCompo || { structure: 'content' };
  const compoKey = activeCompoKey || '';
  const [type] = compoKey.split('.');
  const structure = type === 'appendings' ? 'content' : compoData.structure;

  invariant(
    !activeCompo || structure,
    'structure should be defined in component state.',
  );

  const handleEditor = useCallback(
    (editorState) => {
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
            }),
          );
          break;
        case 'rewordings':
          dispatch(
            updateRewordingEditor({
              bundleId,
              nodeId,
              rewordingId: activeCompo.rewordingId,
              editorState,
            }),
          );
          break;
        case 'appendings':
          dispatch(
            updateAppendBlock({
              bundleId: activeCompo.bundleId,
              nodeId: activeCompo.nodeId,
              pivotId: activeCompo.pivotId,
              editorState,
            }),
          );
          break;
        default:
          logging.debug('Unknown type :', type);
      }
    },
    [activeCompoKey],
  );

  const handleChangeTemplate = (value) => {
    dispatch(
      changeTemplate({
        bundleId: workspace.bundleId,
        nodeId: workspace.nodeId,
        template: value,
      }),
    );
  };

  const handleInitRelease = () => {
    const bundle = bundleState.data;
    // section release
    const activeHeading = getActiveHeading(
      scrollContext.activeSection,
      nodeState.outline,
    );
    if (activeHeading) {
      dispatch(
        initSectionRelease({
          bundleId: nodeState.basic.bundle_id,
          nodeId: nodeState.basic.id,
          titleId: activeHeading.id,
          basicInfo: {
            title: activeHeading.text,
            summary: '',
            author: bundle.user,
            category: bundle.category,
            applyScenes: bundle.apply_scenes
              ? bundle.apply_scenes.map((item) => ({
                  value: item,
                  label: item,
                }))
              : null,
          },
        }),
      );
    } else {
      dispatch(
        initRelease({
          bundle,
          nodes: bundle.nodes,
          basicInfo: {
            title: bundle.title,
            summary: bundle.summary,
            author: bundle.user,
            category: bundle.category,
            applyScenes: bundle.apply_scenes
              ? bundle.apply_scenes.map((item) => ({
                  value: item,
                  label: item,
                }))
              : null,
          },
        }),
      );
    }
  };

  const initPageCreate = () => {
    const href = {
      pathname: '/dimzou-edit',
      query: {
        pageName: 'create',
      },
    };
    Router.push(href, getAsPath(href));
  };

  const initCoverCreate = () => {
    const href = {
      pathname: '/dimzou-edit',
      query: {
        pageName: 'create',
        type: 'cover',
      },
    };
    Router.push(href, getAsPath(href));
  };

  const handleCreateCopy = () => {
    dispatch(
      asyncCreateCopyBundle({
        bundleId: workspace.bundleId,
      }),
    );
  };

  return (
    <DraftDocker
      className={props.className}
      blockStructure={structure}
      editorState={compoData.editorState}
      onEditorChange={handleEditor}
      editorMode={compoData.editorMode}
      canChangeTemplate={
        userCapabilities.canChangeTemplate &&
        bundleState?.data?.status !== BUNDLE_STATUS_PUBLISHED
      }
      initialTemplate={getTemplate(nodeState)}
      changeTemplate={handleChangeTemplate}
      canRelease={userCapabilities.canPublish}
      isReleaseActive={workspace.isReleasePanelOpened}
      initRelease={handleInitRelease}
      isPageCreateActive={false}
      onPageCreateButtonClick={initPageCreate}
      isCoverCreateActive={false}
      onCoverCreateButtonClick={initCoverCreate}
      canCopy={bundleState?.data?.status === BUNDLE_STATUS_PUBLISHED}
      initCopyCreate={handleCreateCopy}
    />
  );
}

Docker.propTypes = {
  className: PropTypes.string,
};

export default Docker;
