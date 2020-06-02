import React, { useContext } from 'react'
import { WorkspaceContext, PublicationBundleContext } from '../../context'

import { BundleRender } from '../AppRenders'
import AppSidebarFirst from '../AppSidebarFirst';
import Node from './BookNode';
import PublicationDocker from './PublicationDocker';

function BookRender() {
  const { bundleId, nodeId: activeNodeId } = useContext(WorkspaceContext);
  const pBundleState = useContext(PublicationBundleContext);

  const { data: {
    nodes,
  } } = pBundleState;
  
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
      sidebarFirst={(
        <AppSidebarFirst />
      )}
    />
  )
}

export default BookRender;