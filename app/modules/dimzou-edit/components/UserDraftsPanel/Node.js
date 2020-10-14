import { useContext } from 'react';
import Router from 'next/router'
import classNames from 'classnames';
import PropTypes from 'prop-types';
import NodeDropzone from './NodeDropzone';
import DraggableNodeLabel from './DraggableNodeLabel';
// import NodeOutline from '../NodeOutline';
// import NodeContextProvider from '../../providers/NodeContextProvider';
import RoleIcon from '../RoleIcon'
import { NODE_TYPE_COVER, NODE_STATUS_PUBLISHED } from '../../constants'
import { getUserRole } from '../../utils/collaborators';
import { WorkspaceContext, ScrollContext } from '../../context';
import { LabelButton } from '../ScrollButton';
import { getAsPath } from '../../utils/router';
import Outline from './Outline';


export default function Node(props) {
  const { data, index, bundleId, currentUser, onSort, type } = props;
  const workspace = useContext(WorkspaceContext);
  const scrollContext = useContext(ScrollContext);
  const isPublication = type === 'publication';
  const isCurrent = String(data.id) === workspace.nodeId && (workspace.isPublicationView === isPublication);
  const isCoverNode = data.node_type === NODE_TYPE_COVER;
  const isPublished = data.status === NODE_STATUS_PUBLISHED;
  const isOwner = data.user && data.user.uid === currentUser.uid;
  const role = props.showRoleOfUser && getUserRole(props.showRoleOfUser, data.collaborators);
  const href = {
    pathname: '/dimzou-edit',
    query: {
      bundleId,
      nodeId: data.id,
      isPublicationView: isPublication,
    },
  };
  // const shouldSpy = String(bundleId) === String(workspace.bundleId); // bundle active;
  const isActive = isCurrent && !scrollContext.activeHash;
  return (
    <div
      className={classNames('dz-DraftsPanelNode dz-DraftsPanelNode_node', {
        'is-current': isCurrent,
      })}
    >
      {!isCoverNode && <NodeDropzone type="node" bundleId={bundleId} index={index} nodeId={data.id} position="before" handleDrop={onSort} />}
      <div className='dz-DraftsPanelNode__inner'>
        <DraggableNodeLabel
          className={isCurrent ? 'is-current': undefined}
          disabled={isPublished || isCoverNode || !isOwner}
          type="node" 
          bundleId={bundleId} 
          index={index} 
          data={data} 
          name={
            <LabelButton
              key={data.id}
              className={isActive ? 'is-active' : undefined}
              onClick={() => {
                window.scrollTo(0, 0);
                Router.push(href, getAsPath(href));
              }}
              data-node-level='node'
            >
              {data.text_title}
            </LabelButton>
          } 
          subTitle={role !== false && <RoleIcon role={role} />}
        />
        {type === 'draft' && (
          <Outline 
            data={data} 
            href={href}
          />
        )}
        {/* {type === 'draft' && isCurrent && (
          <NodeContextProvider bundleId={workspace.bundleId} nodeId={workspace.nodeId}>
            <NodeOutline />
          </NodeContextProvider>
        )} */}
      </div>
      {!isCoverNode && (
        <NodeDropzone type="node" bundleId={bundleId} index={index} nodeId={data.id} position="after" handleDrop={onSort} />
      )}
    </div>
  )
}

Node.propTypes = {
  data: PropTypes.object,
  currentUser: PropTypes.object,
  index: PropTypes.number,
  bundleId: PropTypes.number,
  onSort: PropTypes.func,
  showRoleOfUser: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  type: PropTypes.oneOf([
    'publication',
    'draft',
  ]),
}