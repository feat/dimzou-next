import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { getOutline } from './helpers';
import { ScrollContext } from '../../context';
import { getAsPath } from '../../utils/router';
import { Node as TNode, Element as TElement } from '../Explorer';

function OutlineWrap(props) {
  const { activeSection } = useContext(ScrollContext);
  const { data, href, depth } = props;
  const headings = useMemo(() => getOutline(data), [data]);

  if (!headings || !headings.length) {
    return null;
  }

  return (
    <div>
      {headings.map((item) => {
        const hash = `#content-${item.id}`;
        const targetHref = { ...href, hash };
        return (
          <TElement key={item.id}>
            <Link href={targetHref} as={getAsPath(targetHref)} passHref>
              <TNode
                data-type="header"
                active={activeSection === hash && !!item.label} // 避免出版混淆
                depth={depth + 1}
                label={
                  item.label || (
                    <span dangerouslySetInnerHTML={{ __html: item.htmlCont }} />
                  )
                }
              />
            </Link>
          </TElement>
        );
      })}
    </div>
  );
}

OutlineWrap.propTypes = {
  data: PropTypes.object,
  href: PropTypes.object,
  depth: PropTypes.number,
};

export default OutlineWrap;
