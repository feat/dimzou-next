import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function TextRewording(props) {
  const { data, className, onClick, contentSuffix } = props;
  const dom = useRef(null);
  useEffect(() => {
    if (dom.current && contentSuffix) {
      const h1 = dom.current.querySelector('h1');
      if (h1) {
        if (typeof contentSuffix === 'string') {
          const textNode = document.createTextNode(contentSuffix);
          h1.appendChild(textNode);
          return () => {
            try {
              h1.removeChild(textNode)
            } catch (err) {
              logging.error(err);
            }
          };
        } 
        if (typeof contentSuffix === 'object') {
          const node = contentSuffix;
          h1.appendChild(node);
          return () => {
            try {
              h1.removeChild(node)
            } catch (err) {
              logging.error(err);
            }
          };
        }
      }
    }
    return () => {};
  }, [data.id, contentSuffix])

  return (
    <div
      ref={dom}
      className={classNames('typo-Article', className)}
      dangerouslySetInnerHTML={{ __html: data.html_content }}
      onClick={onClick}
    />
  );
}

TextRewording.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  contentSuffix: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
};

export default TextRewording;
