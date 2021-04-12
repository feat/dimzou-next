import React, { useContext } from 'react';
import get from 'lodash/get';
import LazyImage from '@feat/feat-ui/lib/lazy-image';
import { PublicationContext } from '../../context';
import { getTemplate } from '../../utils/workspace';
import { getTemplateCoverRatio } from '../../utils/template';

function PublicationCover() {
  const publicationState = useContext(PublicationContext);
  const cover = get(publicationState, 'data.cover');
  const template = getTemplate();

  return (
    <LazyImage
      ratio={getTemplateCoverRatio(template)}
      src={cover || undefined}
    />
  );
}

export default PublicationCover;
