import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/modules/auth/selectors';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import RewordableSection from '../RewordableSection';
import ContentBlockRender from '../ContentBlockRender';
import { BundleContext, NodeContext, UserCapabilitiesContext } from '../../context'
import { getVersionLabel } from '../../utils/bundle';

import intlMessages from '../../messages';

function NodeTitle() {
  const bundleState = useContext(BundleContext);
  const nodeState = useContext(NodeContext);
  const userCapabilities = useContext(UserCapabilitiesContext);
  const node = nodeState && nodeState.data;
  const currentUser = useSelector(selectCurrentUser);

  const versionLabel = getVersionLabel(bundleState.data);
  
  const versionEl = useMemo(() => {
    const el = document.createElement('span');
    el.innerText = versionLabel;
    el.style.fontSize = '0.7em';
    el.style.marginLeft = '0.5em';
    return el;
  }, [versionLabel])

  return (
    <RewordableSection
      mode={bundleState.mode}
      bundleId={node.bundle_id}
      nodeId={node.id}
      blockId={node.title.id}
      rewordings={node.title.rewordings}
      info={node.title.info}
      structure="title"
      currentUser={currentUser}
      userCapabilities={userCapabilities}
      editorPlaceholder={
        <div className="typo-Article__titlePlaceholder">
          <TranslatableMessage message={intlMessages.titlePlaceholder} />
        </div>
      }
      contentSuffix={versionEl}
      render={ContentBlockRender}
    />
  )
}

export default NodeTitle;