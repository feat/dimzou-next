import React, { Component } from 'react';
import PropTypes from 'prop-types';

import commonMessages from '@/messages/common';

import Button from '@feat/feat-ui/lib/button';
import getViewportHeight from '@feat/feat-ui/lib/util/getViewportHeight';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

class LoadMoreAnchor extends Component {
  componentDidMount() {
    if (this.props.immediately) {
      this.props.loadMore();
    }
    if (this.props.initFetch) {
      this.tryToLoadMore();
    }
    if (this.props.watchScroll) {
      this.watchScroll = true;
      const wrapperNode = this.props.overflow ? this.dom.parentNode : window;
      this.wrapperNode = wrapperNode;
      wrapperNode.addEventListener('scroll', this.tryToLoadMore);
    }
  }

  componentWillUnmount() {
    if (this.props.watchScroll || this.watchScroll) {
      this.wrapperNode.removeEventListener('scroll', this.tryToLoadMore);
    }
  }

  tryToLoadMore = () => {
    if (this.props.loading) {
      return;
    }
    const box = this.dom.getBoundingClientRect();
    const viewportHeight = getViewportHeight();
    if (
      box.top < viewportHeight + this.props.delta &&
      !this.props.scrollDisabled
    ) {
      this.props.loadMore();
    }
  };

  render() {
    return (
      <div
        ref={(n) => {
          this.dom = n;
        }}
        className={this.props.className}
        style={this.props.style}
      >
        <Button
          block
          type="merge"
          disabled={this.props.loading}
          onClick={this.props.loadMore}
        >
          {this.props.loading && (
            <TranslatableMessage message={commonMessages.loading} />
          )}
          {!this.props.loading &&
            (this.props.message || (
              <TranslatableMessage message={commonMessages.loadMore} />
            ))}
        </Button>
      </div>
    );
  }
}

LoadMoreAnchor.propTypes = {
  delta: PropTypes.number,
  loadMore: PropTypes.func,
  watchScroll: PropTypes.bool, // init watch
  scrollDisabled: PropTypes.bool,
  loading: PropTypes.bool,
  initFetch: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  message: PropTypes.node,
  overflow: PropTypes.bool,
  immediately: PropTypes.bool,
};

LoadMoreAnchor.defaultProps = {
  delta: 150,
  watchScroll: true,
};

export default LoadMoreAnchor;
