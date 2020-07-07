import React, { useContext } from 'react';
import { NodeContext, ScrollContext } from '../../context';
import Outline from './Outline';

import './style.scss';

function NodeOutline() {
  const nodeState = useContext(NodeContext);
  const scrollContext = useContext(ScrollContext);

  const data = nodeState && nodeState.outline;

  if (!data) {
    return null;
  }

  const mapped = data.map((item) => ({
    id: item.id,
    label: item.current.content,
  }));

  return (
    <Outline
      data={mapped}
      activeHash={scrollContext.activeHash}
      onItemClick={(hash) => {
        scrollContext.setScrollHash(hash);
      }}
    />
  );
}

export default NodeOutline;
