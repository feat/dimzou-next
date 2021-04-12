import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';

class StyleButton extends Component {
  onToggle = (e) => {
    e.preventDefault();
    this.props.onToggle(this.props.style);
  };

  render() {
    const {
      icon,
      label,
      description,
      style,
      isActive,
      iconFirst,
      disabled,
    } = this.props;
    return (
      <ButtonBase
        className={classNames(
          'dz-DockerButton',
          `dz-DockerButton_${style.toLowerCase()}`,
          { 'is-active': isActive },
        )}
        onMouseDown={this.onToggle}
        aria-label={description}
        disabled={disabled}
      >
        {icon}
        {iconFirst && icon ? null : label}
      </ButtonBase>
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
