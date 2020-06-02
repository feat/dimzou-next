import React from 'react';
import { FeedTemplateIII as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIIIPlaceholder';
import DimzouCardII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIIPlaceholder';

class FeedTemplateIII extends Base {
  static displayName = 'FeedTemplateIII';

  renderI(item, index) {
    return (
      <DimzouCardIII
        titleLines={2}
        bodyLines={12}
        key={index}
      />
    );
  }

  renderII(item, index) {
    return (
      <DimzouCardII
        layoutType="L"
        titleLines={2}
        bodyLines={7}
        key={index}
      />
    );
  }
}

FeedTemplateIII.defaultProps = {
  ...Base.defaultProps,
  items: Object.keys([...new Array(Base.maxItemCount)]).map((id) => ({ id })),
};

export default FeedTemplateIII;
