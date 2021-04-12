import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { selectCommentsCount } from '../../selectors';

function CommentsCount(props) {
  const { entityType, entityId, initialCount, ...rest } = props;
  const count = useSelector((state) => selectCommentsCount(state, props));
  return <span {...rest}>{count !== undefined ? count : initialCount}</span>;
}

CommentsCount.propTypes = {
  initialCount: PropTypes.number,
  count: PropTypes.number,
};

export default CommentsCount;
