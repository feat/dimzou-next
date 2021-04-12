/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import classNames from 'classnames';
import { ScrollLink } from 'react-scroll';
import Link from 'next/link';
import './style.scss';

export function LabelButton({ className, href, as, ...props }) {
  if (href || as) {
    return (
      <Link href={href} as={as} prefetch={false}>
        <a className={classNames('dz-LabelButton', className)} {...props} />
      </Link>
    );
  }
  return <a className={classNames('dz-LabelButton', className)} {...props} />;
}

export default ScrollLink(LabelButton);
