import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function TabPane(props) {
  const { className } = props;
  return (
    <div className={classNames('ft-Tabs__pane', className)}>
      {props.children}
    </div>
  );
}

TabPane.propTypes = {
  dataKey: PropTypes.any,
  tab: PropTypes.node,
};
