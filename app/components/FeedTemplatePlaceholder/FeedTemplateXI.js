import React from 'react';
import { FeedTemplateXI as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardV from '@feat/feat-ui/lib/dimzou-card/DimzouCardVPlaceholder';
import DimzouCardI from '@feat/feat-ui/lib/dimzou-card/DimzouCardIPlaceholder';

class FeedTemplateXI extends Base {
  static displayName = 'FeedTemplateXI';

  renderI() {
    return (
      <DimzouCardV
        titleLines={2}
        bodyLines={2}
        imageRatio={10 / 3}
      />
    );
  }

  renderII() {
    return (
      <DimzouCardI
        titleLines={2}
        bodyLines={2}
      />
    );
  }
}

FeedTemplateXI.defaultProps = {
  ...Base.defaultProps,
  items: Object.keys([...new Array(Base.maxItemCount)]).map((id) => ({ id })),
};

export default FeedTemplateXI;
