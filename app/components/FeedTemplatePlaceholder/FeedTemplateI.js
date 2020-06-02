import React from 'react';
import { FeedTemplateI as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIIIPlaceholder';
import DimzouCardII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIIPlaceholder';

class FeedTemplateI extends Base {
  static displayName = 'FeedTemplateI';

  renderI(item, index) {
    return (
      <DimzouCardIII
        titleLines={4}
        bodyLines={5}
        key={index}
      />
    );
  }

  renderII(item, index) {
    return (
      <DimzouCardII
        titleLines={2}
        bodyLines={4}
        key={index}
      />
    );
  }

  renderIII(item, index) {
    return (
      <DimzouCardIII
        titleLines={3}
        bodyLines={12}
        key={index}
      />
    );
  }

  renderIV(item, index) {
    return (
      <DimzouCardII
        titleLines={2}
        bodyLines={4}
        key={index}
      />
    );
  }

  renderV(item, index) {
    return (
      <DimzouCardIII
        titleLines={2}
        bodyLines={6}
        key={index}
      />
    );
  }
}

FeedTemplateI.defaultProps = {
  ...Base.defaultProps,
  items: Object.keys([...new Array(Base.maxItemCount)]).map((id) => ({ id })),
};

export default FeedTemplateI;
