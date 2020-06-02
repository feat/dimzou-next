import React from 'react';
import { FeedTemplateX as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIIIPlaceholder';
import DimzouCardII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIIPlaceholder';


class FeedTemplateX extends Base {
  static displayName = 'FeedTemplateX';

  renderI(item, index) {
    return (
      <DimzouCardIII
        titleLines={2}
        bodyLines={5}
        key={index}
      />
    );
  }

  renderII(item, index) {
    return (
      <DimzouCardII
        titleLines={2}
        bodyLines={7}
        key={index}
      />
    );
  }
}

FeedTemplateX.defaultProps = {
  ...Base.defaultProps,
  items: Object.keys([...new Array(Base.maxItemCount)]).map((id) => ({ id })),
};

export default FeedTemplateX;
