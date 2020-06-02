import React from 'react';
import { FeedTemplateVII as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIIIPlaceholder';


class FeedTemplateVII extends Base {
  static displayName = 'FeedTemplateVII';

  renderI() {
    return (
      <DimzouCardIII
        titleLines={2}
        bodyLines={12}
      />
    );
  }

  renderII() {
    return (
      <DimzouCardIII
        titleLines={3}
        bodyLines={5}
      />
    );
  }
}

FeedTemplateVII.defaultProps = {
  ...Base.defaultProps,
  items: Object.keys([...new Array(Base.maxItemCount)]).map((id) => ({ id })),
};

export default FeedTemplateVII;
