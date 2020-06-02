import React from 'react';
import PropTypes from 'prop-types';

export default function Video(props) {
  const data = props.contentState.getEntity(props.entityKey).getData();
  const blockKey = props.offsetKey.split('-')[0];
  const dragData = { entityKey: props.entityKey, blockKey };
  return (
    <video
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
      }}
      {...data}
    />
  );
}

Video.propTypes = {
  offsetKey: PropTypes.string,
  entityKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  contentState: PropTypes.object,
};
