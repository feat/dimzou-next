import React, { useContext } from 'react';
import get from 'lodash/get';
import { maxTextContent } from '@/utils/content';
import { PublicationContext } from '../../context';

function PublicationTitle() {
  const publicationState = useContext(PublicationContext);
  const title = get(publicationState, 'data.title');

  return (
    <div className="typo-Article">
      <h1>{maxTextContent(title)}</h1>
    </div>
  )
}

export default PublicationTitle;