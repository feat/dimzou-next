import React from 'react';
import { FeedTemplateIX as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIIIPlaceholder';
import DimzouCardII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIIPlaceholder';


class FeedTemplateIX extends Base {
  static displayName = 'FeedTemplateIX';

  renderI() {
    return (
      <DimzouCardIII
        titleLines={2}
        bodyLines={8}
      />
    );
  }

  renderII() {
    return (
      <DimzouCardIII
        titleLines={2}
        bodyLines={5}
      />
    );
  }

  renderIII() {
    return (
      <DimzouCardII
        titleLines={2}
        bodyLines={5}
      />
    );
  }
}

FeedTemplateIX.defaultProps = {
  ...Base.defaultProps,
  items: Object.keys([...new Array(Base.maxItemCount)]).map((id) => ({ id })),
};


export default FeedTemplateIX;
