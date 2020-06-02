import React from 'react';
import omit from 'lodash/omit';
import { FeedTemplateIIS as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIII';
import { renderAvatar } from './common';

class FeedTemplateIIS extends Base {
  static displayName = 'FeedTemplateIIS';

  renderI(item, index, itemProps) {
    return (
      <DimzouCardIII
        {...itemProps}
        {...omit(item, ['meta'])}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={3}
        bodyLines={4}
        key={index}
      />
    );
  }
}

export default FeedTemplateIIS;
