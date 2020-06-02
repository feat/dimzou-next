import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import IconButton from '@feat/feat-ui/lib/button/IconButton';
import Button from '@feat/feat-ui/lib/button';
import notification from '@feat/feat-ui/lib/notification';

import './style.scss';

class AddCategoryWidget extends React.PureComponent {
  state = {
    isActive: false,
    name: '',
  };

  componentDidMount() {
    this.customIsMounted = true;
  }

  componentWillUnmount() {
    this.customIsMounted = false;
  }

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
      parentId: this.props.parent && this.props.parent.id,
      name: this.state.name,
    };
    this.setState({
      isSubmittting: true,
    });
    this.props.onSubmit(data)
      .catch((err) => {
        logging.debug(err);
        notification.error({
          message: 'Error',
          description: err.message,
        })
        if (this.customIsMounted) {
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
        className={classNames('AddCategoryWidget', {
          'is-expanded': isActive,
          'is-static': !isActive,
        })}
      >
        {isActive && (
          <form
            className="AddCategoryWidget__form"
            onSubmit={this.handleSubmit}
          >
            <input
              autoFocus
              className="AddCategoryWidget__input"
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
              className="AddCategoryWidget__btn"
              svgIcon="ok-btn"
              size="sm"
              htmlType="submit"
              disabled={!this.state.name.trim() || this.state.isSubmittting}
            />
          </form>
        )}
        {!isActive && <Button>{this.props.newLabel}</Button>}
      </div>
    );
  }
}

AddCategoryWidget.propTypes = {
  parent: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  newLabel: PropTypes.node,
};

AddCategoryWidget.defaultProps = {
  newLabel: 'New',
};

export default AddCategoryWidget;
