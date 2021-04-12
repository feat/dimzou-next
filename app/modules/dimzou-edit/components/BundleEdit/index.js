import React, { useContext } from 'react';
import WorkshopNavigator from '../WorkshopNavigator';
import { BundleContext, WorkspaceContext } from '../../context';
import Node from './Node';

import CollaboratorBlock from '../CollaboratorBlock';
import SettingsBlock from '../SettingsBlock';
import Docker from '../NodeEdit/Docker';
import { BundleRender } from '../AppRenders';

import './style.scss';

function BundleEdit() {
  const { bundleId, nodeId: activeNodeId } = useContext(WorkspaceContext);
  const bundleState = useContext(BundleContext);
  const { nodes } = bundleState.data;

  return (
    <BundleRender
      main={
        <>
          {nodes.map((node, index) => (
            <Node
              brief={node}
              bundleId={bundleId}
              nodeId={node.id}
              activeNodeId={activeNodeId}
              key={node.id}
              nodes={nodes}
              index={index}
            />
          ))}
          <Docker />
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

export default BundleEdit;
