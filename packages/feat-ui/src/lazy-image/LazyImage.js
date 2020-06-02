import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { namespace as defaultNamespace } from '../config';

import getViewportHeight from '../util/getViewportHeight';

class LazyImage extends Component {
  static propTypes = {
    namespace: PropTypes.string,
    offset: PropTypes.number,
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
    ratio: PropTypes.number,
    container: PropTypes.string,
    containerDom: PropTypes.object,
    style: PropTypes.object,
  };

  static defaultProps = {
    namespace: defaultNamespace,
    offset: 50,
    ratio: 16 / 9,
  };

  state = {};

  componentDidMount() {
    this.containerDom = this.getContainerDom();
    this.tryToLoadImage();
    this.containerDom.addEventListener('scroll', this.tryToLoadImage);
  }

  componentWillUnmount() {
    this.containerDom.removeEventListener('scroll', this.tryToLoadImage);
  }

  getContainerDom() {
    if (this.props.containerDom) {
      return this.props.containerDom;
    }
    if (this.props.container) {
      return document.querySelector(this.props.container) || window;
    }
    return window;
  }

  tryToLoadImage = () => {
    if (!this.dom) return;
    const domBox = this.dom.getBoundingClientRect();
    const viewportHeight = getViewportHeight();
    if (domBox.top < viewportHeight + this.props.offset) {
      this.setState({ shouldRenderImage: true });
      this.containerDom.removeEventListener('scroll', this.tryToLoadImage);
    }
  };

  render() {
    const {
      src,
      style = {},
      ratio = 1,
      className,
      namespace,
      ...restProps
    } = this.props;
    const renderStyle = { ...style };
    if (ratio) {
      renderStyle.width = '100%';
      renderStyle.paddingTop = `${(100 / ratio).toFixed(2)}%`;
    }
    if (this.state.shouldRenderImage && src) {
      renderStyle.backgroundImage = `url(${src})`;
    }
    const blockName = `${namespace}-LazyImage`;
    return (
      <div
        ref={(n) => {
          this.dom = n;
        }}
        className={classNames(className, blockName)}
        style={renderStyle}
        {...restProps}
      />
    );
  }
}

export default LazyImage;
