import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeSelectCommentsCount } from '../../selectors';

function CommentsCount(props) {
  return (
    <span>{props.count === undefined ? props.initialCount : props.count}</span>
  );
}

CommentsCount.propTypes = {
  initialCount: PropTypes.number,
  count: PropTypes.number,
};

const selectCommentsCount = makeSelectCommentsCount();
export default connect(selectCommentsCount)(CommentsCount);
