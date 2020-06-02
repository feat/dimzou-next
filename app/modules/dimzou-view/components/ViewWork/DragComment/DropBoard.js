import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import update from 'immutability-helper';
import DragBox from './DragBox';

import './style.scss';

class DropBoard extends React.Component {
  state = {
    board: { bottom: 300, right: 100 },
  };

  moveBoard(right, bottom) {
    this.setState(
      update(this.state, {
        board: {
          $set: { right, bottom },
        },
      }),
    );
  }

  render() {
    const { connectDropTarget, children } = this.props;
    const { board } = this.state;
    return connectDropTarget(
      <div className="comment__DropBoard">
        <DragBox right={board.right} bottom={board.bottom} hideSourceOnDrag>
          {children}
        </DragBox>
      </div>,
    );
  }
}

DropBoard.propTypes = {
  connectDropTarget: PropTypes.func,
  children: PropTypes.object,
};

export default DropTarget(
  'comment',
  {
    drop(props, monitor, component) {
      if (!component) {
        return;
      }
      const dropBoard = document.querySelector('.comment__DropBoard');
      const item = monitor.getItem();
      const delta = monitor.getDifferenceFromInitialOffset();
      const right = Math.round(item.right - delta.x);
      const bottom = Math.round(item.bottom - delta.y);
      component.moveBoard(right, bottom);
      dropBoard.style.pointerEvents = 'none';
    },
  },
  (connect) => ({
    connectDropTarget: connect.dropTarget(),
  }),
)(DropBoard);
