import React from 'react';
import { FeedTemplateIIIS as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardV from '@feat/feat-ui/lib/dimzou-card/DimzouCardVPlaceholder';
import DimzouCardII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIIPlaceholder';

class FeedTemplateIIIS extends Base {
  static displayName = 'FeedTemplateIIIS';

  renderI(item, index) {
    return (
      <DimzouCardV
        titleLines={2}
        bodyLines={4}
        key={index}
      />
    );
  }

  renderII(item, index) {
    return (
      <DimzouCardII
        titleLines={2}
        bodyLines={5}
        key={index}
      />
    );
  }
}

export default FeedTemplateIIIS;
