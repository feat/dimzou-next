import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.scss';

function Block({ title, subHeader, className, children, ...rest }) {
  return (
    <div className={classNames('Block', className)} {...rest}>
      <div className="Block__header">
        <div className="Block__title">{title}</div>
        <div className="Block__subHeader">{subHeader}</div>
      </div>
      <div className="Block__content">{children}</div>
    </div>
  );
}

Block.propTypes = {
  title: PropTypes.node,
  subHeader: PropTypes.node,
  children: PropTypes.any,
  className: PropTypes.string,
};
export default Block;
