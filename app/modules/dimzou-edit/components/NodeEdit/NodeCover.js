import { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/modules/auth/selectors';

import RewordableSection from '../RewordableSection';
import CoverBlockRender from '../CoverBlockRender';
import {
  BundleContext,
  NodeContext,
  UserCapabilitiesContext,
} from '../../context';

function NodeCover(props) {
  const bundleState = useContext(BundleContext);
  const nodeState = useContext(NodeContext);
  const userCapabilities = useContext(UserCapabilitiesContext);
  const nodeBasic = nodeState && nodeState.basic;
  const currentUser = useSelector(selectCurrentUser);

  const block = nodeState.blocks[nodeState.cover];

  return (
    <RewordableSection
      mode={bundleState.mode}
      bundleId={nodeBasic.bundle_id}
      nodeId={nodeBasic.id}
      blockId={nodeState.cover || `node:${nodeBasic.id}`}
      rewordings={block ? block.rewordings : undefined}
      info={block ? block.info : {}}
      structure="cover"
      template={props.template}
      currentUser={currentUser}
      userCapabilities={userCapabilities}
      render={CoverBlockRender}
    />
  );
}

NodeCover.propTypes = {
  template: PropTypes.string,
};

export default NodeCover;
