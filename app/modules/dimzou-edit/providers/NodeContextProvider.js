import PropTypes from 'prop-types'
import { useContext, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { asyncFetchNodeEditInfo } from '../actions'
import { WorkspaceContext, NodeContext } from '../context'
import { selectNodeState } from '../selectors'
import { getCurrentVersion } from '../utils/rewordings'
import { isHeading } from '../utils/content'

function NodeContextProvider(props) {
  const workspace = useContext(WorkspaceContext);
  const nodeState = useSelector((state) => selectNodeState(state, props));
  const dispatch = useDispatch();
  useEffect(() => {
    // may fetch data
    if (!nodeState && props.nodeId && props.shouldFetchData) {
      dispatch(asyncFetchNodeEditInfo({
        bundleId: props.bundleId,
        nodeId: props.nodeId,
        invitationCode: workspace.invitationCode,
      }))
    }
  }, [props.bundleId, props.nodeId, props.shouldFetchData]);

  const outline = useMemo(() => {
    if (!nodeState || !nodeState.data || !nodeState.data.content) {
      return null;
    }
    const { content } = nodeState.data;
    return content.map((item) => ({
      id: item.id,
      sort: item.sort,
      current: getCurrentVersion(item.rewordings),
    })).filter((item) => item.current && isHeading(item.current.html_content, 2));
  }, [nodeState && nodeState.data]);

  const combined = useMemo(() => {
    if (!nodeState) {
      return nodeState;
    }
    return ({
      ...nodeState,
      outline,
    })
  }, [nodeState, outline])
  
  return (
    <NodeContext.Provider value={combined}>
      {props.children}
    </NodeContext.Provider>
  )
}

NodeContextProvider.propTypes = {
  children: PropTypes.node,
  bundleId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  nodeId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  shouldFetchData: PropTypes.bool,
}

NodeContextProvider.defaultProps = {
  shouldFetchData: true,
}

export default NodeContextProvider