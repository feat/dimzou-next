import React from 'react';
import omit from 'lodash/omit';
import { FeedTemplateXIII as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIV from '@feat/feat-ui/lib/dimzou-card/DimzouCardIV';

import { renderAvatar } from './common';

class FeedTemplateXIII extends Base {
  static displayName = 'FeedTemplateXIII';

  renderI(item, index, itemProps) {
    return (
      <DimzouCardIV
        {...itemProps}
        {...omit(item, ['meta'])}
        key={index}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={2}
        bodyLines={6}
      />
    );
  }
}

export default FeedTemplateXIII;
