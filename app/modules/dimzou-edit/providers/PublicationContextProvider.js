import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { asyncFetchBundlePublication } from '../actions'
import { PublicationContext } from '../context'
import { selectNodePublication } from '../selectors'

function PublicationContextProvider(props) {
  const nodePublicationState  = useSelector((state) => selectNodePublication(state, props));
  const dispatch = useDispatch();
  useEffect(() => {
    // may fetch data
    if (!nodePublicationState && props.nodeId && props.shouldFetchData) {
      dispatch(asyncFetchBundlePublication({
        bundleId: props.bundleId,
        nodeId: props.nodeId,
      }))
    }
  }, [props.bundleId, props.nodeId, props.shouldFetchData]);
  
  return (
    <PublicationContext.Provider value={nodePublicationState}>
      {props.children}
    </PublicationContext.Provider>
  )
}

PublicationContextProvider.propTypes = {
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

PublicationContextProvider.defaultProps = {
  shouldFetchData: true,
}

export default PublicationContextProvider