import React from 'react';
import omit from 'lodash/omit';
import { FeedTemplateVII as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIII';
import { renderAvatar } from './common';
class FeedTemplateVII extends Base {
  static displayName = 'FeedTemplateVII';

  renderI(item, index, itemProps) {
    return (
      <DimzouCardIII
        {...itemProps}
        {...omit(item, ['meta'])}
        key={index}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={2}
        bodyLines={12}
      />
    );
  }

  renderII(item, index, itemProps) {
    return (
      <DimzouCardIII
        {...itemProps}
        {...omit(item, ['meta'])}
        key={index}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={3}
        bodyLines={5}
      />
    );
  }
}

export default FeedTemplateVII;
