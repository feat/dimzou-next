import classNames from 'classnames';

import styles from './index.module.scss';

import Icon from '../Icon';

function NodeIcon(props) {
  return (
    <span
      className={classNames(styles.node__icon, {
        [styles.canToggle]: props.onClick,
      })}
      onClick={props.onClick}
    >
      <Icon name={props.icon} />
    </span>
  );
}

export default NodeIcon;
