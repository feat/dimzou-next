import React from 'react';
import classNames from 'classnames';

import './style.scss';

export const ReportTable = React.forwardRef((props, ref) => (
  <div className={classNames('dz-ReportTable', props.className)} ref={ref}>
    {props.children}
  </div>
));

export const ReportTableHeader = React.forwardRef((props, ref) => (
  <div
    className={classNames('dz-ReportTable__header', props.className)}
    ref={ref}
  >
    {props.children}
  </div>
));

export const ReportTableCell = React.forwardRef((props, ref) => (
  <div
    className={classNames(
      'dz-ReportTable__cell',
      props.className,
      props.modifier ? `dz-ReportTable__cell_${props.modifier}` : undefined,
    )}
    ref={ref}
  >
    {props.children}
  </div>
));

export const ReportTableRow = React.forwardRef((props, ref) => (
  <div className={classNames('dz-ReportTable__row', props.className)} ref={ref}>
    {props.children}
  </div>
));
