import React from 'react';
import omit from 'lodash/omit';
import { FeedTemplateIII as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIII';
import DimzouCardII from '@feat/feat-ui/lib/dimzou-card/DimzouCardII';
import { renderAvatar } from './common';

class FeedTemplateIII extends Base {
  static displayName = 'FeedTemplateIII';

  renderI(item, index, itemProps) {
    return (
      <DimzouCardIII
        {...itemProps}
        {...omit(item, ['meta'])}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={2}
        bodyLines={12}
        key={index}
      />
    );
  }

  renderII(item, index, itemProps) {
    return (
      <DimzouCardII
        {...itemProps}
        {...omit(item, ['meta'])}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        layoutType="L"
        titleLines={2}
        bodyLines={7}
        key={index}
      />
    );
  }
}

export default FeedTemplateIII;
