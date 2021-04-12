import React, { useContext } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import cMessages from '@/messages/common';

import PublicationTitle from './PublicationTitle';
import PublicationSummary from './PublicationSummary';
import PublicationContent from './PublicationContent';
import PublicationCover from './PublicationCover';
import NextAnchor from '../NextAnchor';

import { PublicationContext } from '../../context';
import { NODE_TYPE_COVER, NODE_TYPE_CHAPTER } from '../../constants';
import { tryToFetchPublication } from '../../actions';

function BookNodeRender(props) {
  const publicationState = useContext(PublicationContext);
  const dispatch = useDispatch();

  const {
    brief: { node_type, text_title: title, text_summary: summary },
  } = props;

  const id = `node-${props.nodeId}`;
  const className = classNames('dz-PageContent', {
    'dz-PageContent_chapter': node_type === NODE_TYPE_CHAPTER,
    'dz-PageContent_cover': node_type === NODE_TYPE_COVER,
  });

  const nextAnchor = (
    <NextAnchor
      index={props.index}
      nodes={props.nodes}
      onActivate={(nodeDesc) => {
        logging.debug('prefetch publication data');
        dispatch(
          tryToFetchPublication({
            bundleId: props.bundleId,
            nodeId: nodeDesc.id,
          }),
        );
      }}
    />
  );

  if (publicationState && publicationState.fetchError) {
    return (
      <div id={id} name={id} className={className} style={{ height: '90vh' }}>
        <div className="dz-Typo">
          <h1 style={{ marginTop: 24 }}>{title}</h1>
          <div className="dz-Typo__summary">
            <p>{summary}</p>
          </div>
        </div>
        <div>{publicationState.fetchError.message}</div>
        {nextAnchor}
      </div>
    );
  }

  if (!publicationState || !publicationState.data) {
    return (
      <div id={id} name={id} className={className} style={{ height: '90vh' }}>
        <div className="dz-Typo">
          <h1 style={{ marginTop: 24 }}>{title}</h1>
          <div className="dz-Typo__summary">
            <p>{summary}</p>
          </div>
        </div>
        <TranslatableMessage message={cMessages.loading} />
      </div>
    );
  }

  if (node_type === NODE_TYPE_COVER) {
    return (
      <div id={id} name={id} className={className}>
        <PublicationTitle />
        <PublicationSummary />
        <PublicationCover template="IV" />
        {nextAnchor}
      </div>
    );
  }

  if (node_type === NODE_TYPE_CHAPTER) {
    return (
      <div name={id} id={id} className={className}>
        <div style={{ marginBottom: 24 }}>
          <PublicationCover template="CHAPTER" />
        </div>
        <PublicationTitle />
        <PublicationSummary />
        <PublicationContent />
        {nextAnchor}
      </div>
    );
  }
}

export default BookNodeRender;
