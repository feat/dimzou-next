import React, { Component } from 'react';
import PropTypes from 'prop-types';

import getViewportHeight from '@feat/feat-ui/lib/util/getViewportHeight';

class ReachEndAnchor extends Component {
  componentDidMount() {
    if (this.props.watchScroll) {
      this.watchScroll = true;
      window.addEventListener('scroll', this.tryToTrigger);
    }
  }

  componentWillUnmount() {
    if (this.props.watchScroll || this.watchScroll) {
      window.removeEventListener('scroll', this.tryToTrigger);
    }
  }

  tryToTrigger = () => {
    if (this.props.processing) {
      return;
    }
    const box = this.dom.getBoundingClientRect();
    const viewportHeight = getViewportHeight();
    if (
      box.top < viewportHeight + this.props.delta &&
      !this.props.scrollDisabled
    ) {
      this.props.action();
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
        {this.props.children}
      </div>
    );
  }
}

ReachEndAnchor.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  delta: PropTypes.number,
  processing: PropTypes.bool,
  action: PropTypes.func,
  watchScroll: PropTypes.bool,
  scrollDisabled: PropTypes.bool,
  children: PropTypes.any,
};

ReachEndAnchor.defaultProps = {
  delta: 0,
  watchScroll: true,
};

export default ReachEndAnchor;
