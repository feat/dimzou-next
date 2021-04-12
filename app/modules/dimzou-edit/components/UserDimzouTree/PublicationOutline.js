import React, { useContext, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { PublicationContext, ScrollContext } from '../../context';
import { Node as TNode, Element as TElement } from '../Explorer';

function PublicationOutline(props) {
  const { depth } = props;
  const domRef = useRef(null);
  const publicationState = useContext(PublicationContext);
  const { activeSection, setActiveSection } = useContext(ScrollContext);
  const content = publicationState?.data?.content;
  const headings = useMemo(
    () => {
      if (!content) {
        return [];
      }
      const dom = document.createElement('div');
      dom.innerHTML = content;
      const headers = dom.querySelectorAll('h2');
      return [...headers].map((node, index) => ({
        id: `title-${index + 1}`, // 此处需要与 RichContnet 组件配合
        label: node.innerText,
      }));
    },
    [content],
  );

  useEffect(
    () => {
      const { hash } = window.location;
      const anchor = hash && domRef.current?.querySelector(`[href='${hash}']`);
      if (anchor) {
        anchor.click();
      }
    },
    [headings],
  );

  return (
    <div ref={domRef}>
      {headings.map((item) => {
        const hash = `#${item.id}`;
        return (
          <TElement key={item.id}>
            <TNode
              data-type="header"
              depth={depth + 1}
              label={item.label}
              active={activeSection === hash}
              href={hash}
              onClick={() => {
                setActiveSection(hash);
                //   setScrollHash();
              }}
            />
          </TElement>
        );
      })}
    </div>
  );
}

PublicationOutline.propTypes = {
  depth: PropTypes.number,
};

export default PublicationOutline;
