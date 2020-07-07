import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Outline from '../NodeOutline/Outline';
import { getOutline } from './helpers';
import { getAsPath } from '../../utils/router';
import { ScrollContext } from '../../context';

function OutlineWrap(props) {
  const scrollContext = useContext(ScrollContext);
  const { data, href } = props;
  const router = useRouter();

  return (
    <Outline
      data={getOutline(data)}
      activeHash={scrollContext.activeHash}
      onItemClick={(hash, sort, paragraphId) => {
        const hashHref = {
          ...href,
          hash,
        };
        scrollContext.setSort(sort);
        scrollContext.setParagraphId(paragraphId);
        router.push(hashHref, getAsPath(hashHref));
      }}
    />
  );
}

OutlineWrap.propTypes = {
  data: PropTypes.object,
  href: PropTypes.object,
};

export default OutlineWrap;
