import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import get from 'lodash/get';

import { selectCurrentUser } from '@/modules/auth/selectors';
import { initCache, getCache } from '@/services/cache';

import CommentBundle from '@/modules/comment/components/CommentBundle';

import {
  asyncCreateRewordingComment,
  asyncUpdateRewordingComment,
  asyncDeleteRewordingComment,
  registerRewordingCommentBundle,
  initRewordingCommentBundle,
  fetchRewordingCommentTree,

  toggleBlockExpanded,
  closeCommentPanel,
} from '../../actions';

import { makeSelectRewordingCommentBundle } from '../../selectors';
import { MeasureContext } from '../../context';

class RewordingCommentBundle extends React.Component {
  constructor(props) {
    super(props);
    this.cacheKey = `rewording_comment:${props.rewordingId}`;
    const cache = getCache(this.cacheKey);
    if (!cache || (!cache.options.userId && props.currentUser.uid)) {
      initCache(
        {
          cacheKey: this.cacheKey,
          userId: props.currentUser.uid,
        },
        true,
      );
    }
  }

  componentWillMount() {
    if (!this.props.bundleState) {
      this.props.registerRewordingCommentBundle({
        nodeId: this.props.nodeId,
        rewordingId: this.props.rewordingId,
        rootCount: this.props.rootCount,
        initialData: this.props.initialData,
      });
    }
  }

  componentDidUpdate(preProps) {
    const { shouldRender, bundleState } = this.props;
    if (shouldRender && bundleState && !bundleState.isInitialized) {
      this.props.initRewordingCommentBundle({
        nodeId: this.props.nodeId,
        rewordingId: this.props.rewordingId,
      });
    }
    if (preProps.bundleState !== bundleState && this.context) {
      this.context.measure();
    }

  }

  getCache = () => getCache(this.cacheKey);

  handleCreateComment = (data) => {
    const preData = {
      rewordingId: this.props.rewordingId,
      nodeId: this.props.nodeId,
      content: data.htmlContent,
      parentId: data.parentId,
      structure: this.props.structure,
      blockId: this.props.blockId,
    };
    this.props.toggleBlockExpanded({
      nodeId: this.props.nodeId,
      blockId: this.props.blockId,
      structure: this.props.structure,
      expandedType: 'comment',
    });
    this.props.closeCommentPanel({
      rewordingId: this.props.rewordingId,
    });
    return this.props.createComment(preData);
  };

  handleUpdateComment = (data) => {
    const preData = {
      id: data.id,
      parentId: data.parentId,
      content: data.htmlContent,
      rewordingId: this.props.rewordingId,
      nodeId: this.props.nodeId,
      structure: this.props.structure,
      blockId: this.props.blockId,
    };
    return this.props.updateComment(preData);
  };

  handleDeleteComment = (data) => {
    const preData = {
      ...data,
      rewordingId: this.props.rewordingId,
      nodeId: this.props.nodeId,
      structure: this.props.structure,
      blockId: this.props.blockId,
    };
    return this.props.deleteComment(preData);
  };

  handleLoadMore = () => {
    const { bundleState } = this.props;
    this.props.fetchRewordingCommentTree({
      nodeId: this.props.nodeId,
      rewordingId: this.props.rewordingId,
      next: get(bundleState, 'pagination.next'),
    });
  };

  render() {
    const {
      bundleState,
      currentUser,
      entityCapabilities,
      className,
      rewordingId,
      isCommentActive,
      pageLayout,
    } = this.props;
    if (!bundleState) {
      return null;
    }
    // const shouldRenderBundle =
    //   shouldRender || (bundleState && bundleState.isInitialized);
    // const shouldRenderBundle = this.props.rootCount;
    // const style = shouldRender ? undefined : { display: 'none' };
    return (
      <CommentBundle
        key={`RewordingCommentBundle-${rewordingId}`}
        className={className}
        style={undefined}
        cache={this.getCache()}
        entityCapabilities={entityCapabilities}
        bundleState={bundleState}
        currentUser={currentUser}
        onCreateComment={this.handleCreateComment}
        onUpdateComment={this.handleUpdateComment}
        onDeleteComment={this.handleDeleteComment}
        loadMore={this.handleLoadMore}
        pageLayout={pageLayout}
        isComment={!isCommentActive}
        autoFocus
        showSectionHeader
      />
    );
  }
}

RewordingCommentBundle.contextType = MeasureContext;

RewordingCommentBundle.propTypes = {
  className: PropTypes.string,
  nodeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  rewordingId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  rootCount: PropTypes.number,
  entityCapabilities: PropTypes.shape({
    canComment: PropTypes.bool,
  }),
  bundleState: PropTypes.shape({
    isInitialized: PropTypes.bool,
    comments: PropTypes.array,
  }),
  fetchRewordingCommentTree: PropTypes.func.isRequired,
  initRewordingCommentBundle: PropTypes.func.isRequired,
  registerRewordingCommentBundle: PropTypes.func.isRequired,

  createComment: PropTypes.func,
  updateComment: PropTypes.func,
  deleteComment: PropTypes.func,
  currentUser: PropTypes.object,
  shouldRender: PropTypes.bool,
  isCommentActive: PropTypes.bool,

  closeCommentPanel: PropTypes.func,
  toggleBlockExpanded: PropTypes.func,
  blockId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  structure: PropTypes.string,
  initialData: PropTypes.array,
  pageLayout: PropTypes.bool,
};

RewordingCommentBundle.defaultProps = {
  pageLayout: true,
}

const mapStateToProps = (state, props) => {
  const bundleStateSelector = makeSelectRewordingCommentBundle(state, props);
  return createStructuredSelector({
    currentUser: selectCurrentUser,
    bundleState: bundleStateSelector,
  });
};

const mapDispatchToProps = {
  createComment: asyncCreateRewordingComment,
  updateComment: asyncUpdateRewordingComment,
  deleteComment: asyncDeleteRewordingComment,
  fetchRewordingCommentTree,
  registerRewordingCommentBundle,
  initRewordingCommentBundle,
  toggleBlockExpanded,
  closeCommentPanel,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(RewordingCommentBundle);
