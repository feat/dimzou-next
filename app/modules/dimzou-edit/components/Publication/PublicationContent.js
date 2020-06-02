import React, { useContext } from 'react';
import get from 'lodash/get';
import RichContent from '@/components/RichContent';
import { PublicationContext } from '../../context';

function PublicationContent() {
  const publicationState = useContext(PublicationContext);
  const content = get(publicationState, 'data.content');

  return (
    <RichContent className="typo-Article" html={content} />
  )
}

export default PublicationContent;