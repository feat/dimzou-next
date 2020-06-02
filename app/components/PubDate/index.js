import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formatDate } from '@/utils/time';

const PubDate = ({ date, format, className }) => (
  <span className={classNames('t-PubDate', className)}>
    {formatDate(date, format)}
  </span>
);

PubDate.propTypes = {
  className: PropTypes.string,
  format: PropTypes.string,
  date: PropTypes.any, // TODO: update date proptypes
};

PubDate.defaultProps = {
  format: 'yyyy MM dd HH:mm',
};

export default PubDate;
