import { useContext, useMemo } from 'react';
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
import { getVersionLabel } from '../../utils/bundle';

import intlMessages from '../../messages';

function NodeTitle() {
  const bundleState = useContext(BundleContext);
  const nodeState = useContext(NodeContext);
  const userCapabilities = useContext(UserCapabilitiesContext);
  const nodeBasic = nodeState && nodeState.basic;
  const currentUser = useSelector(selectCurrentUser);

  const versionLabel = getVersionLabel(bundleState.data);

  const versionEl = useMemo(
    () => {
      const el = document.createElement('span');
      el.innerText = versionLabel;
      el.style.fontSize = '0.7em';
      el.style.marginLeft = '0.5em';
      return el;
    },
    [versionLabel],
  );

  const block = nodeState.blocks[nodeState.title] || {};

  return (
    <RewordableSection
      mode={bundleState.mode}
      bundleId={nodeBasic.bundle_id}
      nodeId={nodeBasic.id}
      blockId={block.id}
      rewordings={block.rewordings}
      info={block.info}
      structure="title"
      currentUser={currentUser}
      userCapabilities={userCapabilities}
      editorPlaceholder={
        <div className="dz-Typo__titlePlaceholder">
          <TranslatableMessage message={intlMessages.titlePlaceholder} />
        </div>
      }
      contentSuffix={versionEl}
      versionLabel={versionLabel}
      render={ContentBlockRender}
      shouldHighlighted={window.location.hash === `#title-${block.id}`}
    />
  );
}

export default NodeTitle;
