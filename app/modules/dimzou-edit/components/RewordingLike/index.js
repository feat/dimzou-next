import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LikeButton from '@/components/LikeButton';

import {
  initLikeWidget,
  likeRewording,
  unlikeRewording,
} from '../../actions';
import {
  selectNodeUserRewordingLikes,
  selectLikeWidgetState,
} from '../../selectors';

import './style.scss';

class RewordingLikeWidget extends React.PureComponent {
  componentWillMount() {
    if (!this.props.isInitialized) {
      this.props.dispatch(
        initLikeWidget({
          nodeId: this.props.nodeId,
          structure: this.props.structure,
          blockId: this.props.blockId,
          rewordingId: this.props.rewordingId,
          rewordingLikesCount: this.props.rewordingLikesCount,
        }),
      );
    }
  }

  handleClick = () => {
    const creator = this.props.hasLiked ? unlikeRewording : likeRewording;
    this.props.dispatch(
      creator({
        bundleId: this.props.bundleId,
        nodeId: this.props.nodeId,
        structure: this.props.structure,
        blockId: this.props.blockId,
        rewordingId: this.props.rewordingId,
      }),
    );
  };

  render() {
    return (
      <div className="dz-RewordingLikeWidget">
        <LikeButton onClick={this.handleClick} hasLiked={this.props.hasLiked} />
        <span className="dz-RewordingLikeWidget__num">
          {this.props.rewordingLikesCount}
        </span>
      </div>
    );
  }
}

RewordingLikeWidget.propTypes = {
  isInitialized: PropTypes.bool,
  bundleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  blockId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rewordingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  structure: PropTypes.string,
  hasLiked: PropTypes.bool,
  rewordingLikesCount: PropTypes.number,
  dispatch: PropTypes.func,
};

const mapStateToProps = (state, props) => {
  const likeMap = selectNodeUserRewordingLikes(state, props);
  const likeWidgetState = selectLikeWidgetState(state, props);
  return {
    hasLiked: likeMap[props.rewordingId],
    ...likeWidgetState,
  };
};

export default connect(mapStateToProps)(RewordingLikeWidget);
