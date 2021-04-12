import { useContext } from 'react';
import get from 'lodash/get';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import SplashView from '@/components/SplashView';

import { NodeContext, BundleContext } from '../../context';
import { getChapterRender, CoverRender } from '../AppRenders';
import WorkshopNavigator from '../WorkshopNavigator';
import NodeCover from './NodeCover';
import NodeTitle from './NodeTitle';
import NodeSummary from './NodeSummary';
import NodeContent from './NodeContent';
// import NodeNavAnchor from '../NodeNavAnchor';
import CollaboratorBlock from '../CollaboratorBlock';
import SettingsBlock from '../SettingsBlock';
import Docker from './Docker';
import ProgressBar from '../ProgressBar';
import { getTemplate } from '../../utils/workspace';
import { NODE_TYPE_COVER } from '../../constants';
import { copyright } from '../../messages';

function NodeEdit() {
  // get template and mached Render
  const bundleState = useContext(BundleContext);
  const nodeState = useContext(NodeContext);
  const template = getTemplate(nodeState);
  const Render = getChapterRender(template);

  if (
    bundleState &&
    bundleState.data &&
    nodeState &&
    nodeState.basic &&
    nodeState.basic.type === NODE_TYPE_COVER
  ) {
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
            {/* <NodeNavAnchor /> */}
          </>
        }
        sidebarFirst={<WorkshopNavigator />}
        sidebarSecond={
          <>
            <CollaboratorBlock />
            <SettingsBlock />
          </>
        }
      />
    );
  }
  if (bundleState && bundleState.data && nodeState && nodeState.basic) {
    const { id } = nodeState.basic;
    return (
      <Render
        id={id}
        title={<NodeTitle />}
        summary={<NodeSummary />}
        content={
          <>
            <NodeContent key={id} className="dz-Edit__chapterContent" />
            <Docker />
            {/* <NodeNavAnchor /> */}
          </>
        }
        cover={<NodeCover template={template} />}
        sidebarFirst={<WorkshopNavigator />}
        sidebarSecond={
          <>
            <CollaboratorBlock />
            <SettingsBlock />
          </>
        }
      />
    );
  }

  let content;
  if (bundleState && bundleState.fetchError) {
    content = (
      <div style={{ paddingTop: 56, paddingBottom: 56 }}>
        {bundleState.fetchError.message}
      </div>
    );
  } else if (!bundleState || !bundleState.data) {
    content = <SplashView />;
  } else if (!nodeState || (nodeState.isFetchingEditInfo && !nodeState.basic)) {
    content = (
      <SplashView
        hint={<ProgressBar value={get(nodeState, 'loadingProgress', 0)} />}
      />
    );
  } else if (nodeState && nodeState.fetchError) {
    content = (
      <div style={{ paddingTop: 56, paddingBottom: 56 }}>
        {nodeState.fetchError.message}
      </div>
    );
  }
  return <Render content={content} sidebarFirst={<WorkshopNavigator />} />;
}

export default NodeEdit;
