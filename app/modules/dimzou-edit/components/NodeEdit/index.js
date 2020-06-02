import { useContext } from 'react'
import get from 'lodash/get'

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import SplashView from '@/components/SplashView';

import { NodeContext } from '../../context'
import { getChapterRender, CoverRender } from '../AppRenders';
import AppSidebarFirst from '../AppSidebarFirst';
import NodeCover from './NodeCover';
import NodeTitle from './NodeTitle';
import NodeSummary from './NodeSummary';
import NodeContent from './NodeContent';
import NodeNavAnchor from '../NodeNavAnchor';
import CollaboratorBlock from '../CollaboratorBlock';
import SettingsBlock from '../SettingsBlock';
import Docker from '../Docker';
import ProgressBar from '../ProgressBar';
import { getTemplate } from '../../utils/workspace';
import { NODE_TYPE_COVER } from '../../constants';
import { copyright } from '../../messages';

function NodeEdit() {
  // get template and mached Render
  const nodeState = useContext(NodeContext);
  const template = getTemplate(nodeState);
  const Render = getChapterRender(template);

  if (!nodeState || nodeState.isFetchingEditInfo || nodeState.fetchError) {
    let content;
    if (!nodeState || (nodeState.isFetchingEditInfo && !nodeState.data)) {
      content = (
        <SplashView 
          hint={
            <ProgressBar value={get(nodeState, 'loadingProgress', 0)} />
          } 
        />
      )
    } 
    else if (nodeState && nodeState.fetchError) {
      content = <div style={{ paddingTop: 56, paddingBottom: 56 }}>{nodeState.fetchError.message}</div>
    }
    return (
      <Render 
        content={content}
        sidebarFirst={
          <AppSidebarFirst />
        }
      />
    )
  }
  
  const node = nodeState && nodeState.data;
  if (node && node.type === NODE_TYPE_COVER) {
    return (
      <CoverRender 
        title={<NodeTitle />}
        summary={<NodeSummary />}
        cover={<NodeCover template="IV" />}
        copyright={
          <>
            <TranslatableMessage
              message={copyright.year}
              values={{
                year: new Date().getFullYear(),
              }}
            />
          </>
        }
        extra={
          <>
            <Docker />
            <NodeNavAnchor />
          </>
        }
        sidebarFirst={<AppSidebarFirst />}
        sidebarSecond={
          <>
            <CollaboratorBlock />
            <SettingsBlock />
          </>
        }
      />
    )
  }

  if (node) {
    return (
      <Render 
        id={`node-${node.id}`}
        title={
          <NodeTitle />
        }
        summary={
          <NodeSummary />
        }
        content={(
          <>
            <NodeContent className="dz-Edit__chapterContent" />
            <Docker />
            <NodeNavAnchor />
          </>
        )}
        cover={
          (
            <NodeCover template={template} />
          )
        }
        sidebarFirst={
          <AppSidebarFirst />
        }
        sidebarSecond={
          <>
            <CollaboratorBlock />
            <SettingsBlock />
          </>
        }
      />
    )
  }
  
}

export default NodeEdit;