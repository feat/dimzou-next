import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import IconButton from '@feat/feat-ui/lib/button/IconButton';

import './style.scss';

class AddLocaleWidget extends React.PureComponent {
  state = {
    isActive: false,
    name: '',
  };

  initCreation = () => {
    this.setState({
      isActive: true,
    });
  };

  reset() {
    this.setState({
      isActive: false,
      name: '',
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.name || this.state.isSubmittting) {
      return;
    }
    const data = {
      label: this.state.name,
    };
    this.setState({
      isSubmittting: true,
    });
    this.props.onSubmit(data).catch(() => {
      if (this.isMounted) {
        this.setState({
          isSubmittting: false,
        });
      }
    });
  };

  handleInputBlur = () => {
    if (!this.state.name) {
      this.setState({
        isActive: false,
      });
    }
  };

  render() {
    const { isActive } = this.state;
    return (
      <div
        onClick={this.initCreation}
        role="button"
        tabIndex={0}
        className={classNames('lng-AddLocaleWidget', {
          'is-expanded': isActive,
          'is-static': !isActive,
        })}
      >
        {isActive && (
          <form
            className="lng-AddLocaleWidget__form"
            onSubmit={this.handleSubmit}
          >
            <input
              autoFocus
              className="lng-AddLocaleWidget__input"
              name="name"
              value={this.state.name}
              onBlur={this.handleInputBlur}
              onChange={(e) => {
                const name = e.target.value;
                this.setState({
                  name,
                });
              }}
            />
            <IconButton
              className="lng-AddLocaleWidget__btn"
              size="sm"
              svgIcon="ok-btn"
              htmlType="submit"
              disabled={!this.state.name.trim() || this.state.isSubmittting}
            />
          </form>
        )}
        {!isActive && <span>New</span>}
      </div>
    );
  }
}

AddLocaleWidget.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default AddLocaleWidget;
