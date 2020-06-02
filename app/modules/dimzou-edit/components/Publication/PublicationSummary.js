import React, { useContext } from 'react';
import get from 'lodash/get';
import { PublicationContext } from '../../context';

function PublicationSummary() {
  const publicationState = useContext(PublicationContext);
  const summary = get(publicationState, 'data.summary');

  return (
    <div className="typo-Article">
      <div className="typo-Article__summary" dangerouslySetInnerHTML={{ __html: summary }} />
    </div>
  )
}

export default PublicationSummary;