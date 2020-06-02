import React from 'react';

import { FeedTemplateIS as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIIIPlaceholder';
import DimzouCardI from '@feat/feat-ui/lib/dimzou-card/DimzouCardIPlaceholder';

class FeedTemplateIS extends Base {
  static displayName = 'FeedTemplateIS';

  renderI(item, index) {
    return (
      <DimzouCardIII
        key={index}
        titleLines={4}
        bodyLines={3}
      />
    );
  }

  renderII(item, index) {
    return (
      <DimzouCardI
        key={index}
        titleLines={2}
        bodyLines={3}
        layoutType="J"
      />
    );
  }
}

export default FeedTemplateIS;
