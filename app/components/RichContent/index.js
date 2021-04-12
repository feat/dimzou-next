/**
 *
 * RichContent
 *
 */

import React, { useRef, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

// import styled from 'styled-components';
// import classNames from 'classnames';
import composeRefs from '@seznam/compose-react-refs';
import './style.scss';

const RichContent = forwardRef((props, ref) => {
  const domRef = useRef(null);

  const { html, ...resetProps } = props;

  useEffect(
    () => {
      if (!domRef.current) {
        return;
      }

      const codeBlocks = domRef.current.querySelectorAll('pre[data-language]');

      Array.prototype.forEach.call(codeBlocks, (node) => {
        const codeNode = node.querySelector('code');
        if (codeNode) {
          const code = codeNode.innerHTML
            .split('\n')
            .map((item) => `<span class="line">${item}</span>`)
            .join('\n');
          // eslint-disable-next-line
        codeNode.classList.add('wrap');
          codeNode.innerHTML = code;
        }
      });

      const headings = domRef.current.querySelectorAll('h2');
      Array.prototype.forEach.call(headings, (node, index) => {
        const anchor = document.createElement('span');
        anchor.setAttribute('id', `title-${index + 1}`);
        anchor.setAttribute('data-anchor', 'true');
        anchor.style.position = 'relative';
        anchor.style.top = '-100px';
        node.appendChild(anchor);
      });
    },
    [html],
  );

  return (
    <div
      ref={composeRefs(domRef, ref)}
      {...resetProps}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

RichContent.propTypes = {
  className: PropTypes.string,
  html: PropTypes.string,
};

export default RichContent;
