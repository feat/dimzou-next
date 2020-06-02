import React from 'react';
import omit from 'lodash/omit';
import { FeedTemplateIIIS as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardV from '@feat/feat-ui/lib/dimzou-card/DimzouCardV';
import DimzouCardII from '@feat/feat-ui/lib/dimzou-card/DimzouCardII';
import { renderAvatar } from './common';

class FeedTemplateIIIS extends Base {
  static displayName = 'FeedTemplateIIIS';

  renderI(item, index, itemProps) {
    return (
      <DimzouCardV
        {...itemProps}
        {...omit(item, ['meta'])}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={2}
        bodyLines={4}
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
        titleLines={2}
        bodyLines={5}
        key={index}
      />
    );
  }
}

export default FeedTemplateIIIS;
