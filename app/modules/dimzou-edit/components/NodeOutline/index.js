import React, { useContext, useCallback } from 'react'
import classNames from 'classnames';

import { LabelButton } from '../ScrollButton';
import { NodeContext, ScrollContext } from '../../context';

import './style.scss'

function NodeOutline() {
  const nodeState = useContext(NodeContext);
  const scrollContext = useContext(ScrollContext);

  const data = nodeState && nodeState.outline;
  
  const handleItemClick = useCallback(
    (e) => {
      const dom = e.target.closest('.dz-LabelButton');
      const dataTarget = dom.dataset.target;
      // console.dir(router, dataTarget);
      scrollContext.setScrollHash(dataTarget);
      // const href = {
      //   pathname: router.pathname,
      //   query: router.query,
      //   hash: dataTarget,
      // };
      // router.push(href, getAsPath(href))
    },
    [],
  );

  if (!data) {
    return null;
  }
  const content = data && data.map((item) => {
    const targetHash = `#content-${item.id}`;
    return (
      <div
        key={item.id}
        className="dz-DimzouOutline__heading dz-DimzouOutline__heading_2"
        style={{ '--heading-level': 2}}
      >
        <LabelButton
          className={classNames({
            'is-active': scrollContext.activeHash === targetHash,
          })}
          data-target={targetHash}
          onClick={handleItemClick}
          data-node-level='heading'
        >
          {item.current.content}
        </LabelButton>
      </div>
    )
  });
  return (
    <div 
      className={classNames("dz-DimzouOutline", {
        'has-content': content && content.length,
      })}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {content}
    </div>
  )
}


export default NodeOutline;