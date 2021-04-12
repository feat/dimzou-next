import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/modules/auth/selectors';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import RewordableSection from '../RewordableSection';
import ContentBlockRender from '../ContentBlockRender';
import {
  BundleContext,
  NodeContext,
  UserCapabilitiesContext,
} from '../../context';

import intlMessages from '../../messages';

function NodeSummary() {
  const bundleState = useContext(BundleContext);
  const nodeState = useContext(NodeContext);
  const userCapabilities = useContext(UserCapabilitiesContext);
  const nodeBasic = nodeState && nodeState.basic;
  const currentUser = useSelector(selectCurrentUser);

  const block = nodeState.blocks[nodeState.summary] || {};

  return (
    <RewordableSection
      mode={bundleState.mode}
      bundleId={nodeBasic.bundle_id}
      nodeId={nodeBasic.id}
      blockId={block.id}
      rewordings={block.rewordings}
      info={block.info}
      structure="summary"
      currentUser={currentUser}
      userCapabilities={userCapabilities}
      editorPlaceholder={
        <TranslatableMessage message={intlMessages.summaryPlaceholder} />
      }
      shouldHighlighted={window.location.hash === `#summary-${block.id}`}
      render={ContentBlockRender}
    />
  );
}

export default NodeSummary;
