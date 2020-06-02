import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/modules/auth/selectors';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import RewordableSection from '../RewordableSection';
import ContentBlockRender from '../ContentBlockRender';
import { BundleContext, NodeContext, UserCapabilitiesContext } from '../../context'

import intlMessages from '../../messages';

function NodeSummary() {
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
      blockId={node.summary.id}
      rewordings={node.summary.rewordings}
      info={node.summary.info}
      structure="summary"
      currentUser={currentUser}
      userCapabilities={userCapabilities}
      editorPlaceholder={
        <TranslatableMessage message={intlMessages.summaryPlaceholder} />
      }
      render={ContentBlockRender}
    />
  )
}

export default NodeSummary;