import React from 'react';
import omit from 'lodash/omit';

import { FeedTemplateXII as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardV from '@feat/feat-ui/lib/dimzou-card/DimzouCardV';
import DimzouCardI from '@feat/feat-ui/lib/dimzou-card/DimzouCardI';

import { renderAvatar } from './common';

class FeedTemplateXII extends Base {
  static displayName = 'FeedTemplateXII';

  renderI(item, index, itemProps) {
    return (
      <DimzouCardV
        {...itemProps}
        {...omit(item, ['meta'])}
        key={index}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={2}
        bodyLines={2}
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
        layoutType="L"
        titleLines={2}
        bodyLines={5}
      />
    );
  }
}

export default FeedTemplateXII;
