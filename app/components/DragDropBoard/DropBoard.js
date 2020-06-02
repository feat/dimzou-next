import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import update from 'immutability-helper';
import DragBox from './DragBox';

import './style.scss';

class DropBoard extends React.Component {
  state = {
    // board: { bottom: this.props.bottom, right: this.props.right },
    board: {
      left: this.props.left,
      bottom: this.props.bottom,
    },
  };

  moveBoard(left, bottom) {
    this.setState(
      update(this.state, {
        board: {
          $set: { left, bottom },
        },
      }),
    );
  }

  render() {
    const { connectDropTarget, children } = this.props;
    const { board } = this.state;
    return connectDropTarget(
      <div className="dd-DropBoard">
        <DragBox
          // right={board.right}
          // bottom={board.bottom}
          left={board.left}
          bottom={board.bottom}
          hideSourceOnDrag
        >
          {children}
        </DragBox>
      </div>,
    );
  }
}

DropBoard.propTypes = {
  connectDropTarget: PropTypes.func,
  children: PropTypes.node,
  bottom: PropTypes.number,
  // right: PropTypes.number,
  left: PropTypes.number,
  // top: PropTypes.number,
};

DropBoard.defaultProps = {
  bottom: 100,
  // right: 100,
  left: Math.round(window.innerWidth * 0.7),
  // top: 100,
};

export default DropTarget(
  'dd',
  {
    drop(props, monitor, component) {
      if (!component) {
        return;
      }
      const dropBoard = document.querySelector('.dd-DropBoard');
      const item = monitor.getItem();
      const delta = monitor.getDifferenceFromInitialOffset();
      // const right = Math.round(item.right - delta.x);
      const bottom = Math.round(item.bottom - delta.y);
      const left = Math.round(item.left + delta.x);
      // const top = Math.round(item.top + delta.y);
      // component.moveBoard(right, bottom);
      component.moveBoard(left, bottom);
      dropBoard.style.pointerEvents = 'none';
    },
  },
  (connect) => ({
    connectDropTarget: connect.dropTarget(),
  }),
)(DropBoard);
