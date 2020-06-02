import React from 'react';
import omit from 'lodash/omit';
import { FeedTemplateVIII as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIII';
import { renderAvatar } from './common';
class FeedTemplateVIII extends Base {
  static displayName = 'FeedTemplateVIII';

  renderI(item, index, itemProps) {
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

export default FeedTemplateVIII;
