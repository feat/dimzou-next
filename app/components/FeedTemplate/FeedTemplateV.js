import React from 'react';
import omit from 'lodash/omit';
import { FeedTemplateV as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIII';
import { renderAvatar } from './common';
class FeedTemplateV extends Base {
  static displayName = 'FeedTemplateV';

  renderI(item, index, itemProps) {
    return (
      <DimzouCardIII
        {...itemProps}
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

export default FeedTemplateV;
