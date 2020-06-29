import React from 'react';
import PropTypes from 'prop-types';

import Rewording from '../RewordingWrap';

export default function RewordingList({
  data,
  type,
  bundleId,
  nodeId,
  structure,
  blockId,
  blockStatus,
  currentUser,
  userCapabilities,
  userHasPendingRewording,
  isElecting,
  onItemDrop,
  showAvatar,
  contentSuffix,
}) {
  const recordCount = data.length;
  return (
    <div
      className={`dz-BlockSection__rewordings dz-BlockSection__rewordings_${type}`}
      key={type}
    >
      {data.map((record, index) => (
        <Rewording
          type={type}
          count={recordCount}
          index={index}
          modifier={type}
          key={record.id}
          rewordingId={record.id}
          bundleId={bundleId}
          nodeId={nodeId}
          structure={structure}
          blockId={blockId}
          blockStatus={blockStatus}
          data={record}
          currentUser={currentUser}
          userCapabilities={userCapabilities}
          userHasPendingRewording={userHasPendingRewording}
          isElecting={isElecting}
          onDrop={onItemDrop}
          renderLevel="rewording"
          showAvatar={showAvatar}
          contentSuffix={contentSuffix}
        />
      ))}
    </div>
  );
}

RewordingList.propTypes = {
  data: PropTypes.array,
  type: PropTypes.string,

  bundleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  structure: PropTypes.oneOf(['title', 'summary', 'content', 'cover']),
  blockId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  blockStatus: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currentUser: PropTypes.object,
  userCapabilities: PropTypes.object,

  userHasPendingRewording: PropTypes.bool,
  isElecting: PropTypes.bool,
  showAvatar: PropTypes.bool,
  onItemDrop: PropTypes.func,

  contentSuffix: PropTypes.string,
};
