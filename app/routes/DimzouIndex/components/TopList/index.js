import React from 'react';
import PropTypes from 'prop-types';

import TopListItem from './TopListItem';

import './style.scss';

export default function TopList(props) {
  const { data, prefix } = props;

  return (
    <ul className="mostItemList">
      {data.map((record, i) => (
        <TopListItem prefix={prefix} {...record} number={i + 1} />
      ))}
    </ul>
  );
}

TopList.propTypes = {
  data: PropTypes.array,
  prefix: PropTypes.string,
};
