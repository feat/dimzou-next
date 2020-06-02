import React from 'react';
import omit from 'lodash/omit';
import { FeedTemplateI as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIII';
import DimzouCardII from '@feat/feat-ui/lib/dimzou-card/DimzouCardII';
import { renderAvatar } from './common';

class FeedTemplateI extends Base {
  static displayName = 'FeedTemplateI';

  renderI(item, index, itemProps) {
    return (
      <DimzouCardIII
        {...itemProps}
        {...omit(item, ['meta'])}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={4}
        bodyLines={5}
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
        bodyLines={4}
        key={index}
      />
    );
  }

  renderIII(item, index, itemProps) {
    return (
      <DimzouCardIII
        {...itemProps}
        {...omit(item, ['meta'])}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={3}
        bodyLines={12}
        key={index}
      />
    );
  }

  renderIV(item, index, itemProps) {
    return (
      <DimzouCardII
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

  renderV(item, index, itemProps) {
    return (
      <DimzouCardIII
        {...itemProps}
        {...omit(item, ['meta'])}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={2}
        bodyLines={6}
        key={index}
      />
    );
  }
}

export default FeedTemplateI;
