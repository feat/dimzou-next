import React from 'react';

import ParagraphSection from './ParagraphSection';
import ListSection from './ListSection';
import ImageSection from './ImageSection';

function ContentSectionPlaceholder() {
  return (
    <div>
      <ParagraphSection />
      <ListSection />
      <ImageSection />
      <ParagraphSection />
    </div>
  );
}

export default ContentSectionPlaceholder;
