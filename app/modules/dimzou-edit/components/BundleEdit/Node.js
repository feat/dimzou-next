import React from 'react';
import PropTypes from 'prop-types'
import NodeContextProvider from '../../providers/NodeContextProvider';
import UserCapabilitiesProvider from '../../providers/UserCapabilitiesProvider';

import PageContent from './PageContent';

function Node(props) {
  const { brief, index, nodes } = props;
  const isActive = String(props.nodeId) === String(props.activeNodeId);
  
  return (
    <NodeContextProvider 
      bundleId={props.bundleId} 
      nodeId={brief.id}
      shouldFetchData={isActive}
    >
      <UserCapabilitiesProvider>
        <PageContent 
          bundleId={props.bundleId} 
          nodeId={brief.id} 
          brief={brief}  
          index={index}
          nodes={nodes}
          isActive={isActive}
        />
      </UserCapabilitiesProvider>
    </NodeContextProvider>
  )
}

Node.propTypes = {
  bundleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  activeNodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  brief: PropTypes.object,
  nodes: PropTypes.array,
  index: PropTypes.number,
}

export default Node;