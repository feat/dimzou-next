import React, { useContext } from 'react';
import get from 'lodash/get';
import RichContent from '@/components/RichContent';
import HashSpy from '@/modules/dimzou-view/components/HashSpy';
import { PublicationContext, ScrollContext } from '../../context';

function PublicationContent() {
  const publicationState = useContext(PublicationContext);
  const content = get(publicationState, 'data.content');
  const { setActiveSection } = useContext(ScrollContext);

  return (
    <HashSpy
      selector="h2"
      onChange={(el) => {
        if (el) {
          const anchor = el.querySelector('[data-anchor]');
          if (anchor) {
            setActiveSection(`#${anchor.getAttribute('id')}`);
          }
        } else {
          setActiveSection('');
        }
        // setHash(el.getAttribute('id'));
      }}
    >
      {(ref) => <RichContent className="dz-Typo" ref={ref} html={content} />}
    </HashSpy>
  );
}

export default PublicationContent;
