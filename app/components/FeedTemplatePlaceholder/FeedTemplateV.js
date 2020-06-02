import React from 'react';

import { FeedTemplateV as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIIIPlaceholder';

class FeedTemplateV extends Base {
  static displayName = 'FeedTemplateV';

  renderI() {
    return (
      <DimzouCardIII
        titleLines={2}
        bodyLines={5}
      />
    );
  }
}

FeedTemplateV.defaultProps = {
  ...Base.defaultProps,
  items: Object.keys([...new Array(Base.maxItemCount)]).map((id) => ({ id })),
};

export default FeedTemplateV;
