import React from 'react';
import { FeedTemplateXII as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardV from '@feat/feat-ui/lib/dimzou-card/DimzouCardVPlaceholder';
import DimzouCardI from '@feat/feat-ui/lib/dimzou-card/DimzouCardIPlaceholder';

class FeedTemplateXII extends Base {
  static displayName = 'FeedTemplateXII';

  renderI() {
    return (
      <DimzouCardV
        titleLines={2}
        bodyLines={6}
        imageRatio={100 / 70}
      />
    );
  }

  renderII(item, index) {
    return (
      <DimzouCardI
        layoutType="L"
        titleLines={2}
        bodyLines={5}
        key={index}
      />
    );
  }
}

FeedTemplateXII.defaultProps = {
  ...Base.defaultProps,
  items: Object.keys([...new Array(Base.maxItemCount)]).map((id) => ({ id })),
};


export default FeedTemplateXII;
