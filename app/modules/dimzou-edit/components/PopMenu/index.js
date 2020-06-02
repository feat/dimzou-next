import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'

import './style.scss';

const PopMenu = React.forwardRef(({ className, ...rest }, ref) => (
  <div
    className={classNames('dz-PopMenu',className)}
    {...rest}
    ref={ref}
  />
))

export const PopMenuItem = ({ onClick, children }) => (
  <div className='dz-PopMenu__item' onClick={onClick}>
    {children}
  </div>
)
PopMenuItem.propTypes = {
  onClick:PropTypes.func,
  children:PropTypes.node,
}

PopMenu.Item = PopMenuItem;

export default PopMenu;