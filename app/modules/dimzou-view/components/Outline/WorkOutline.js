import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { maxTextContent } from '@/utils/content';
import ContentOutline from './ContentOutline';
import { ScrollContext } from '../../context';
import getHeadings from './getHeadings';
import styles from './index.module.scss';

function WorkOutline(props) {
  const { publication } = props;
  const { hash, setHash } = useContext(ScrollContext);

  const headings = useMemo(
    () => {
      if (!publication?.content) {
        return [];
      }
      return getHeadings(publication.content);
    },
    [publication?.content],
  );

  if (!publication || !headings.length) {
    return null;
  }

  return (
    <div className={styles.block}>
      <div className={styles.title}>{maxTextContent(publication.title)}</div>
      <ContentOutline
        headings={headings}
        depth={0}
        activeHash={hash}
        setActiveHash={setHash}
      />
    </div>
  );
}

WorkOutline.propTypes = {
  publication: PropTypes.object,
};

export default WorkOutline;
