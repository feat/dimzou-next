import React from 'react';
import omit from 'lodash/omit';
import { FeedTemplateXI as Base } from '@feat/feat-ui/lib/feed-template';
import DimzouCardV from '@feat/feat-ui/lib/dimzou-card/DimzouCardV';
import DimzouCardI from '@feat/feat-ui/lib/dimzou-card/DimzouCardI';
import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIII';
import { renderAvatar } from './common';

class FeedTemplateXI extends Base {
  static displayName = 'FeedTemplateXI';

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
    if (this.state.x <= 700) {
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
      <DimzouCardV
        {...itemProps}
        {...omit(item, ['meta'])}
        key={index}
        renderAvatar={renderAvatar}
        onClick={() => itemProps.onClick && itemProps.onClick(item)}
        titleLines={this.state.x <= 1366 ? 1 : 2}
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
        titleLines={2}
        bodyLines={2}
      />
    );
  }
}

export default FeedTemplateXI;
