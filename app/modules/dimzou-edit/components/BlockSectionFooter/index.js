import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import RewordingLikeWidget from '../RewordingLike';
import RewordingCommentTrigger from '../RewordingCommentTrigger';
import InvitationTrigger from '../InvitationTrigger';
import RewordingVersion from '../RewordingVersion';

import {
  BLOCK_EXPANDED_SECTION_VERSIONS,
  BLOCK_EXPANDED_SECTION_COMMENTS,
} from '../../constants';

function BlockSectionFooter(props) {
  const {
    currentUser,
    bundleId,
    nodeId,
    structure,
    blockId,
    modifier,
    currentVersion,
    expandedType,
    toggleExpanded,
  } = props;

  const { user } = currentVersion;

  const isExpanded = !!expandedType;
  
  const handleVersionClick = useCallback(() => {
    toggleExpanded(BLOCK_EXPANDED_SECTION_VERSIONS)
  }, []);
  const handleCommentClick = useCallback(
    () => {
      toggleExpanded(BLOCK_EXPANDED_SECTION_COMMENTS)
    },
    [],
  )

  return (
    <div
      className={classNames('dz-BlockSectionFooter', {
        [`dz-BlockSectionFooter_${modifier}`]: modifier,
      })}
    >
      <div className="dz-BlockSectionFooter__left">
        <span className="dz-BlockSectionFooter__action">
          <RewordingVersion 
            isActive={
              isExpanded && expandedType === BLOCK_EXPANDED_SECTION_VERSIONS
            }
            onClick={handleVersionClick}
            version={currentVersion.submit_version - 1}
          />
        </span>
        <span className="dz-BlockSectionFooter__action">
          <RewordingCommentTrigger
            currentUser={currentUser}
            bundleId={bundleId}
            nodeId={nodeId}
            structure={structure}
            blockId={blockId}
            rewordingId={currentVersion.id}
            initialCount={currentVersion.comments_count || 0}
            isActive={
              isExpanded && expandedType === BLOCK_EXPANDED_SECTION_COMMENTS
            }
            onClick={handleCommentClick}
          />
        </span>
        <span className="dz-BlockSectionFooter__action">
          <RewordingLikeWidget
            bundleId={bundleId}
            nodeId={nodeId}
            structure={structure}
            blockId={blockId}
            rewordingId={currentVersion.id}
            rewordingLikesCount={currentVersion.likes_count}
          />
        </span>
        {props.canInvite && (
          <span className="dz-BlockSectionFooter__action">
            <InvitationTrigger
              bundleId={bundleId}
              nodeId={nodeId}
              structure={structure}
              blockId={blockId}
              rewordingId={currentVersion.id}
              htmlContent={currentVersion.html_content}
              username={user.username}
              userExpertise={user.expertise}
            />
          </span>
        )}
      </div>
      <div className="dz-BlockSectionFooter__right">
        
      </div>
    </div>
  );
}

BlockSectionFooter.propTypes = {
  bundleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  blockId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  structure: PropTypes.string,
  currentVersion: PropTypes.object,
  currentUser: PropTypes.object,
  expandedType: PropTypes.string,
  toggleExpanded: PropTypes.func,
  modifier: PropTypes.string,
  canInvite: PropTypes.bool,
};

export default BlockSectionFooter;
