import React, { useContext } from 'react';
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import cMessages from '@/messages/common';
import { NodeContext } from '../../context';
import NodeTitle from '../NodeEdit/NodeTitle';
import NodeSummary from '../NodeEdit/NodeSummary';
import NodeCover from '../NodeEdit/NodeCover';
import NodeContent from '../NodeEdit/NodeContent';
import NextAnchor from '../NextAnchor';
import { asyncFetchNodeEditInfo } from '../../actions';

import { NODE_TYPE_COVER, NODE_TYPE_CHAPTER } from '../../constants';

function PageContent(props) {
  const nodeContext = useContext(NodeContext);
  const dispatch = useDispatch();
  const {
    brief: { 
      node_type,
      text_title: title,
      text_summary: summary,
    },
  } = props;

  const id = `node-${props.nodeId}`;
  const className = classNames("dz-PageContent", {
    'dz-PageContent_chapter': node_type === NODE_TYPE_CHAPTER,
    'dz-PageContent_cover': node_type === NODE_TYPE_COVER,
  })

  const nextAnchor = (
    <NextAnchor
      nodes={props.nodes} index={props.index} onActivate={(nodeDesc) => {
        dispatch(asyncFetchNodeEditInfo({
          bundleId: props.bundleId,
          nodeId: nodeDesc.id,
        }))
      }} 
    />
  )

  if (nodeContext && nodeContext.fetchError) {
    return (
      <div id={id} name={id} className={className} style={{ height: '90vh' }}>
        <div className="typo-Article">
          <h1 style={{ marginTop: 24 }}>{title}</h1>
          <div className="typo-Article__summary">
            <p>{summary}</p>
          </div>
        </div>
        <div>
          {nodeContext.fetchError.message}
        </div>
        {nextAnchor}
      </div>
    )
  }

  if (!nodeContext || !nodeContext.data) {
    return (
      <div id={id} name={id} className={className} style={{ height: '90vh' }}>
        <div className="typo-Article">
          <h1 style={{ marginTop: 24 }}>{title}</h1>
          <div className="typo-Article__summary">
            <p>{summary}</p>
          </div>
        </div>
        <TranslatableMessage message={cMessages.loading} />
      </div>
    )
  }

  if (node_type === NODE_TYPE_COVER) {
    return (
      <div id={id} name={id} className={className}>
        <NodeCover template="IV" />
        <NodeTitle />
        <NodeSummary />
        {nextAnchor}
      </div>
    )
  }

  if (node_type === NODE_TYPE_CHAPTER) {
    return (
      <div name={id} id={id} className={className}>
        <div style={{ marginBottom: 24}}>
          <NodeCover template="CHAPTER" />
        </div>
        <NodeTitle />
        <NodeSummary />
        <NodeContent isActive={props.isActive} />
        {nextAnchor}
      </div>
    )
  }

  return null;
  
}

PageContent.propTypes = {
  bundleId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  nodeId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  brief: PropTypes.object,
  nodes: PropTypes.array,
  index: PropTypes.number,
  isActive: PropTypes.bool,
}

export default PageContent;
