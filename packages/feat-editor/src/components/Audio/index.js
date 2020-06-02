import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default function Audio(props) {
  const data = props.contentState.getEntity(props.entityKey).getData();
  const blockKey = props.offsetKey.split('-')[0];
  const dragData = { entityKey: props.entityKey, blockKey };
  return (
    <audio
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
      }}
      {...data}
    />
  );
}
