import React from 'react';
import PropTypes from 'prop-types';
import DropBoard from './DropBoard';

const DragDropBoard = ({ children }) => (
  <div>
    <DropBoard>{children}</DropBoard>
  </div>
);
DragDropBoard.propTypes = {
  children: PropTypes.object,
};
export default DragDropBoard;
