import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@feat/feat-ui/lib/button';

class StyleButton extends Component {
  onToggle = (e) => {
    e.preventDefault();
    this.props.onToggle(this.props.style);
  };

  render() {
    const { icon, label, description, style, isActive, iconFirst, disabled } = this.props;
    return (
      <Button
        type="merge"
        className={classNames(
          'dz-EditorButton',
          `dz-EditorButton_${style.toLowerCase()}`,
          { 'is-active': isActive },
        )}
        onMouseDown={this.onToggle}
        aria-label={description}
        disabled={disabled}
      >
        {icon}
        {iconFirst && icon ? null : label}
      </Button>
    );
  }
}

StyleButton.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.node,
  description: PropTypes.string,
  style: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  iconFirst: PropTypes.bool,
  disabled: PropTypes.bool,
};

StyleButton.defaultProps = {
  iconFirst: true,
};

export default StyleButton;
