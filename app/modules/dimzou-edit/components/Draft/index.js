import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import BackButton from '@/components/BackButton';

import NodeEdit from '../NodeEdit';
// import BundleEdit from '../BundleEdit';
import BundleReleasePanel from '../BundleReleasePanel';
import InvitationModal from '../InvitationModal';
import SectionReleasePanel from '../SectionReleasePanel';

import NodeContextProvider from '../../providers/NodeContextProvider';
import UserCapabilitiesProvider from '../../providers/UserCapabilitiesProvider';

import { WorkspaceContext } from '../../context';
import BundleContextProvider from '../../providers/BundleContextProvider';
import ScrollContextProvider from '../../providers/ScrollContextProvider';
import { selectWorkspaceState } from '../../selectors';

function Draft(props) {
  const workspaceState = useSelector(selectWorkspaceState);
  const combined = useMemo(
    () => ({
      ...workspaceState,
      ...props,
    }),
    [workspaceState, props],
  );

  return (
    <WorkspaceContext.Provider value={combined}>
      <BundleContextProvider>
        <NodeContextProvider bundleId={props.bundleId} nodeId={props.nodeId}>
          <ScrollContextProvider>
            <UserCapabilitiesProvider>
              <NodeEdit nodeId={props.nodeId} key={props.nodeId} />
              {/* {isMultiChapter ? <BundleEdit /> : <NodeEdit />} */}
              {workspaceState.isReleasePanelOpened && <BundleReleasePanel />}
              {workspaceState.isSectionReleasePanelOpened && (
                <SectionReleasePanel />
              )}
              <InvitationModal />
              <BackButton />
            </UserCapabilitiesProvider>
          </ScrollContextProvider>
        </NodeContextProvider>
      </BundleContextProvider>
    </WorkspaceContext.Provider>
  );
}

export default Draft;
