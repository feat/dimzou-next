import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

function FieldItem({ label, content, className, modifier }) {
  return (
    <div
      className={classNames('ft-FieldItem', className, {
        [`ft-FieldItem_${modifier}`]: modifier,
      })}
    >
      <div className="ft-FieldItem__label">{label}</div>
      <div className="ft-FieldItem__wrapper">{content}</div>
    </div>
  );
}

FieldItem.propTypes = {
  label: PropTypes.node,
  content: PropTypes.node,
  modifier: PropTypes.string,
  className: PropTypes.string,
};

export default FieldItem;
