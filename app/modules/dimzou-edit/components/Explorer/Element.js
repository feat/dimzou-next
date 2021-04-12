import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.module.scss';

const Element = forwardRef((props, ref) => {
  const { className, isDropzoneActive, ...rest } = props;
  return (
    <div
      className={classNames(classNames, styles.element, {
        [styles.isDropzoneActive]: isDropzoneActive,
      })}
      {...rest}
      ref={ref}
    />
  );
});

Element.propTypes = {
  className: PropTypes.string,
};

export default Element;
