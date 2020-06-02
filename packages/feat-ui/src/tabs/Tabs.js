import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Tab from './Tab';

class Tabs extends Component {
  isActivePane(pane) {
    return (pane.props.dataKey || pane.key) === this.props.activeKey;
  }

  renderTabs() {
    return React.Children.map(this.props.children, (pane) => (
      <Tab
        {...pane.props.tabProps}
        type={this.props.type}
        active={this.isActivePane(pane)}
        onClick={() => this.props.onChange(pane.props.dataKey || pane.key)}
      >
        {pane.props.tab}
      </Tab>
    ));
  }

  renderActivePane() {
    let activePane;
    React.Children.map(this.props.children, (pane) => {
      if (!pane) return null;
      if (this.isActivePane(pane)) {
        activePane = pane;
      }
    });
    if (activePane) {
      return activePane;
    }
    return null;
  }

  render() {
    const { activeKey, className, onChange, ...restProps } = this.props;
    return (
      <div className={classNames('ft-Tabs', className)} {...restProps}>
        <div className="ft-Tabs__tabs">{this.renderTabs()}</div>
        <div className="ft-Tabs__content">{this.renderActivePane()}</div>
      </div>
    );
  }
}

Tabs.propTypes = {
  activeKey: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['normal', 'feat']),
};

Tabs.defaultProps = {
  type: 'feat',
};

export default Tabs;
