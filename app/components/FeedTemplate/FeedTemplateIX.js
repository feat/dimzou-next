import React from 'react';
import omit from 'lodash/omit';
import { FeedTemplateIX as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIII';
import DimzouCardII from '@feat/feat-ui/lib/dimzou-card/DimzouCardII';
import { renderAvatar } from './common';

class FeedTemplateIX extends Base {
  static displayName = 'FeedTemplateIX';

  renderI(item, index, itemProps) {
    return (
      <DimzouCardIII
        {...omit(item, ['meta'])}
        key={index}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={2}
        bodyLines={8}
      />
    );
  }

  renderII(item, index, itemProps) {
    return (
      <DimzouCardIII
        {...omit(item, ['meta'])}
        key={index}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={2}
        bodyLines={5}
      />
    );
  }

  renderIII(item, index, itemProps) {
    return (
      <DimzouCardII
        {...omit(item, ['meta'])}
        key={index}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={2}
        bodyLines={5}
      />
    );
  }
}

export default FeedTemplateIX;
