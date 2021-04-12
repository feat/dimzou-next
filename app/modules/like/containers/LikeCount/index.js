import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectLikeCount } from '../../selectors';

function LikeCount(props) {
  const { entityType, entityId, ...rest } = props;
  const count = useSelector((state) => selectLikeCount(state, props));
  return <span {...rest}>{count || 0}</span>;
}

LikeCount.propTypes = {
  entityType: PropTypes.number,
  entityId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default LikeCount;
