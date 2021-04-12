import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

function DropHint(props) {
  return (
    <div
      className={classNames(styles.dropHint, styles[`depth${props.depth}`])}
      style={props.style}
    />
  );
}

export default DropHint;
