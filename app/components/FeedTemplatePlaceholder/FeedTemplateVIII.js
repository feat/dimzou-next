import React from 'react';
import { FeedTemplateVIII as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIIIPlaceholder';

class FeedTemplateVIII extends Base {
  static displayName = 'FeedTemplateVIII';

  renderI() {
    return (
      <DimzouCardIII
        titleLines={3}
        bodyLines={5}
      />
    );
  }
}

FeedTemplateVIII.defaultProps = {
  ...Base.defaultProps,
  items: Object.keys([...new Array(Base.maxItemCount)]).map((id) => ({ id })),
};

export default FeedTemplateVIII;
