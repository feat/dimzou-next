import React from 'react';
import { FeedTemplateIIS as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIIIPlaceholder';

class FeedTemplateIIS extends Base {
  static displayName = 'FeedTemplateIIS';

  renderI(item, index) {
    return (
      <DimzouCardIII
        titleLines={3}
        bodyLines={4}
        key={index}
      />
    );
  }
}

export default FeedTemplateIIS;
