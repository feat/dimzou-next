import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import styles from './index.module.scss';

function ContentOutline(props) {
  const { headings, depth, activeHash, setActiveHash } = props;

  return (
    <div>
      {headings.map((item) => {
        const hash = `#${item.id}`;
        return (
          <div className={styles.element}>
            <a
              className={classNames(styles.node, styles[`depth${depth + 1}`], {
                [styles.isActive]: hash === activeHash,
              })}
              href={hash}
              onClick={(e) => {
                if (e.metaKey) {
                  return;
                }
                setActiveHash(hash);
              }}
            >
              <span className="t-truncate">{item.label}</span>
            </a>
          </div>
        );
      })}
    </div>
  );
}

ContentOutline.propTypes = {
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  depth: PropTypes.number,
  activeHash: PropTypes.string,
  setActiveHash: PropTypes.func,
};

ContentOutline.defautlProps = {
  depth: 0,
};

export default ContentOutline;
