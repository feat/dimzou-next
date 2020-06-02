import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from './Icon';

const ToolbarButton = (props) => {
  const { isActive, value, onClick, icon, type } = props;
  return (
    <span
      className={classNames('FeatEditorToolbar__button', {
        'is-active': isActive,
      })}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick(value);
      }}
    >
      <Icon icon={props.icon} />
    </span>
  );
};

ToolbarButton.propTypes = {

};

export default ToolbarButton;
