import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Link from 'next/link';
import styles from './index.module.scss';
import ResourceTree from './ResourceTree';
import { getAsPath } from '../../../utils/router';
import Icon from '../../Icon';

function ResourceSection(props) {
  const [expanded, setExpanded] = useState(props.initialExpanded);

  const toggleExpanded = useCallback(
    () => {
      setExpanded(!expanded);
    },
    [expanded],
  );

  return (
    <div className={styles.section}>
      <div
        className={classNames(styles.section__header, styles.sectionHeader)}
        onClick={toggleExpanded}
      >
        <Icon
          name={expanded ? 'expanded' : 'collapsed'}
          className={styles.sectionHeader__icon}
        />
        <span className={styles.sectionHeader__label}>{props.title}</span>
      </div>
      <div className={styles.section__content}>
        {expanded && (
          <ResourceTree
            showToolbars
            toolbarClassName={styles.section__actions}
            userId={props.userId}
            data={props.data}
            selectedNode={props.selectedNode}
            renderLabel={(item, className) => {
              const isBundleCover =
                !item.parentId || item.type === 'collection';
              const href = {
                pathname: '/dimzou-edit',
                query: {
                  pageName: 'dashboard',
                  type: 'detail',
                  userId: props.userId,
                  bundleId: item.bundleId,
                  nodeId: isBundleCover ? undefined : item.nodeId,
                },
              };
              const as = getAsPath(href);
              return (
                <Link href={href} as={as}>
                  <a className={className}>{item.label}</a>
                </Link>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}

ResourceSection.propTypes = {
  initialExpanded: PropTypes.bool,
  data: PropTypes.array,
  selectedNode: PropTypes.string,
  title: PropTypes.node,
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

ResourceSection.defaultProps = {
  initialExpanded: true,
};

export default ResourceSection;
