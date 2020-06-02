/**
 *
 * RichContent
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

// import styled from 'styled-components';
// import classNames from 'classnames';

import './style.scss';

class RichContent extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    // update code block;
    if (!this.dom) {
      return;
    }
    const codeBlocks = this.dom.querySelectorAll('pre[data-language]');
    
    Array.prototype.forEach.call(codeBlocks, (node) => {
      const codeNode = node.querySelector('code');
      if (codeNode) {
        const code = codeNode.innerHTML.split('\n').map((item) => `<span class="line">${item}</span>`).join('\n');
        // eslint-disable-next-line
        codeNode.classList.add('wrap');
        codeNode.innerHTML = code;
      }
    })
  }

  render() {
    const { html, ...resetProps } = this.props;
    return <div ref={(n) => { this.dom = n; }} {...resetProps} dangerouslySetInnerHTML={{ __html: html }} />;
  }
}

RichContent.propTypes = {
  className: PropTypes.string,
  html: PropTypes.string,
};

export default RichContent;
