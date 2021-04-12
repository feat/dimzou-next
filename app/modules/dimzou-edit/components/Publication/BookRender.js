import React, { useContext } from 'react';
import { AppContext, PublicationBundleContext } from '../../context';

import { BundleRender } from '../AppRenders';
import WorkshopNavigator from '../WorkshopNavigator';
import Node from './BookNode';
import PublicationDocker from './PublicationDocker';

// @deprecated 即将删除
function BookRender() {
  const { bundleId, nodeId: activeNodeId } = useContext(AppContext);
  const pBundleState = useContext(PublicationBundleContext);

  const {
    data: { nodes },
  } = pBundleState;

  return (
    <BundleRender
      main={
        <>
          {nodes.map((node, index) => (
            <Node
              key={node.id}
              brief={node}
              bundleId={bundleId}
              nodeId={node.id}
              activeNodeId={activeNodeId}
              nodes={nodes}
              index={index}
            />
          ))}
          <PublicationDocker />
        </>
      }
      sidebarFirst={<WorkshopNavigator />}
    />
  );
}

export default BookRender;
