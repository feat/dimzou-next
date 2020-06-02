import { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/modules/auth/selectors';

import RewordableSection from '../RewordableSection';
import CoverBlockRender from '../CoverBlockRender';
import { BundleContext, NodeContext, UserCapabilitiesContext } from '../../context'

function NodeCover(props) {
  const bundleState = useContext(BundleContext);
  const nodeState = useContext(NodeContext);
  const userCapabilities = useContext(UserCapabilitiesContext);
  const node = nodeState && nodeState.data;
  const currentUser = useSelector(selectCurrentUser);

  return (
    <RewordableSection
      mode={bundleState.mode}
      bundleId={node.bundle_id}
      nodeId={node.id}
      blockId={node.cover.id}
      rewordings={node.cover.rewordings}
      info={node.cover.info}
      structure="cover"
      template={props.template}
      currentUser={currentUser}
      userCapabilities={userCapabilities}
      render={CoverBlockRender}
    />
  )
}

NodeCover.propTypes = {
  template: PropTypes.string,
}

export default NodeCover;