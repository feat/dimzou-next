import React from 'react';
import omit from 'lodash/omit';
import { FeedTemplateX as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIII';
import DimzouCardII from '@feat/feat-ui/lib/dimzou-card/DimzouCardII';
import { renderAvatar } from './common';

class FeedTemplateX extends Base {
  static displayName = 'FeedTemplateX';

  constructor() {
    super();
    this.screenX = this.screenX.bind(this);
    this.state = {
      x: '',
    };
  }

  componentDidMount() {
    const screenx = window.innerWidth;
    this.setState({
      x: screenx,
    });
    window.addEventListener('resize', this.screenX);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.screenX);
  }

  screenX() {
    const screenx = window.innerWidth;
    this.setState({
      x: screenx,
    });
  }

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

  renderII(item, index, itemProps) {
    if (this.state.x <= 1366) {
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
    return (
      <DimzouCardII
        {...itemProps}
        {...omit(item, ['meta'])}
        key={index}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={2}
        bodyLines={7}
      />
    );
  }
}

export default FeedTemplateX;
