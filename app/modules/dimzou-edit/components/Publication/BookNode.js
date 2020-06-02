import React from 'react';
import PropTypes from 'prop-types'

import PublicationContextProvider from '../../providers/PublicationContextProvider';
import BookNodeRender from './BookNodeRender';

function BookNode(props) {
  const { brief } = props;
  return (
    <PublicationContextProvider
      bundleId={props.bundleId} 
      nodeId={brief.id}
      shouldFetchData={String(props.nodeId) === String(props.activeNodeId)}
    >
      <BookNodeRender 
        bundleId={props.bundleId} 
        nodeId={brief.id} 
        brief={brief}  
        index={props.index}
        nodes={props.nodes}
      />
    </PublicationContextProvider>
  )
}

BookNode.propTypes = {
  bundleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  activeNodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  brief: PropTypes.object,
  nodes: PropTypes.array,
  index: PropTypes.number,
}

export default BookNode;
