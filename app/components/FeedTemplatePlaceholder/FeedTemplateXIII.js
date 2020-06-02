import React from 'react';
import { FeedTemplateXIII as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIV from '@feat/feat-ui/lib/dimzou-card/DimzouCardIVPlaceholder';

class FeedTemplateXIII extends Base {
  static displayName = 'FeedTemplateXIII';

  renderI() {
    return (
      <DimzouCardIV
        titleLines={2}
        bodyLines={6}
      />
    );
  }
}

FeedTemplateXIII.defaultProps = {
  ...Base.defaultProps,
  items: Object.keys([...new Array(Base.maxItemCount)]).map((id) => ({ id })),
};


export default FeedTemplateXIII;
