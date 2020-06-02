import React from 'react'
import classNames from 'classnames';
import { ScrollLink } from 'react-scroll'
import './style.scss';

export function LabelButton({className, ...props}) {
  return (
    <span 
      className={classNames('dz-LabelButton', className)}
      {...props}
    />
  )
}

export default ScrollLink(LabelButton);