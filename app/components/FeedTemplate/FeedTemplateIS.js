import React from 'react';
import omit from 'lodash/omit';
import { FeedTemplateIS as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIII';
import DimzouCardI from '@feat/feat-ui/lib/dimzou-card/DimzouCardI';
import { renderAvatar } from './common';
class FeedTemplateIS extends Base {
  static displayName = 'FeedTemplateIS';

  renderI(item, index, itemProps) {
    return (
      <DimzouCardIII
        {...itemProps}
        {...omit(item, ['meta'])}
        key={index}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={4}
        bodyLines={3}
      />
    );
  }

  renderII(item, index, itemProps) {
    return (
      <DimzouCardI
        {...itemProps}
        {...omit(item, ['meta'])}
        key={index}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={2}
        bodyLines={3}
        layoutType="J"
      />
    );
  }
}

export default FeedTemplateIS;
