import { forwardRef, useCallback } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames';
import styles from './index.module.scss';
import NodeIcon from './NodeIcon';

const prevent = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

const Node = forwardRef((props, ref) => {
  const {
    active,
    icon,
    depth,
    actions,
    onToggleExpanded,
    index,
    extra,
    label,
    ...rest
  } = props;
  const onIconClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleExpanded && onToggleExpanded();
    },
    [onToggleExpanded],
  );

  return (
    <a
      className={classNames(styles.node, styles[`depth${props.depth}`], {
        [styles.isActive]: props.active,
        [styles.hasIcon]: props.icon,
      })}
      {...rest}
      ref={ref}
    >
      <div className={styles.node__main}>
        {props.icon && <NodeIcon icon={props.icon} onClick={onIconClick} />}
        <span
          className={classNames(styles.node__label, {
            [styles.noIcon]: !icon,
          })}
        >
          {label}
        </span>
      </div>
      {extra && <div className={styles.node__extra}>{extra}</div>}
      <div className={styles.node__actions} onClick={prevent}>
        {actions}
      </div>
    </a>
  );
});

Node.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.node,
  actions: PropTypes.any,
  extra: PropTypes.any,
  active: PropTypes.bool,
  depth: PropTypes.number,
  onToggleExpanded: PropTypes.func,
  index: PropTypes.number,
};

export default Node;
