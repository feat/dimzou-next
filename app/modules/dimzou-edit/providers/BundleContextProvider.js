import React, { useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types';
import Router from 'next/router'

import { initBundle } from '../actions'
import { WorkspaceContext, BundleContext } from '../context'
import { selectBundleState } from '../selectors'

function BundleContextProvider(props) {
  const workspace = useContext(WorkspaceContext);
  const bundleState = useSelector((state) => selectBundleState(state, workspace));
  const dispatch = useDispatch();

  useEffect(() => {
    if (!workspace.bundleId) {
      return;
    }
    if (workspace.bundleId && !bundleState) {
      dispatch(initBundle({
        bundleId: workspace.bundleId,
        nodeId: workspace.nodeId,
        invitationCode: workspace.invitationCode,
      }))
    }
  }, [workspace.bundleId]);

  useEffect(() => {
    if (!workspace.bundleId) {
      return;
    }
    if (!workspace.nodeId && bundleState && bundleState.data) {
      const nodeId = bundleState.data.nodes[0].id;
      Router.replace({
        pathname: Router.pathname,
        query: {
          ...Router.query,
          nodeId,
        },
      }, `/draft/${workspace.bundleId}/${nodeId}`)
    }
  }, [bundleState, workspace.bundleId, workspace.nodeId])

  return (
    <BundleContext.Provider value={bundleState}>
      {props.children}
    </BundleContext.Provider>
  )
}

BundleContextProvider.propTypes = {
  children: PropTypes.node,
}

export default BundleContextProvider;