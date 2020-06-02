import React from 'react';
import PropTypes from 'prop-types';
import DropBoard from './DropBoard';

const DragComment = ({ children }) => (
  <div>
    <DropBoard>{children}</DropBoard>
  </div>
);
DragComment.propTypes = {
  children: PropTypes.object,
};
export default DragComment;
