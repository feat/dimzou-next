/**
 *
 * CommentBundle
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { selectCurrentUser } from '@/modules/auth/selectors';

import CommentBundle from '../../components/CommentBundle';

import { makeSelectCommentBundle } from '../../selectors';
import commentSocket from '../../socket';

import {
  asyncCreateComment,
  asyncUpdateComment,
  asyncDeleteComment,
  asyncGetCommentTree,
  registerBundle,
  unregisterBundle,
} from '../../actions';

import { getBundleCache, initBundleCache } from '../../cache';

export class CommonCommentBundle extends React.Component {
  constructor(props) {
    super(props);
    initBundleCache(
      {
        entityId: this.props.entityId,
        entityType: this.props.entityType,
      },
      props.currentUser.uid,
    );
  }

  UNSAFE_componentWillMount() {
    this.props.registerBundle({
      entityType: this.props.entityType,
      entityId: this.props.entityId,
      rootCount: this.props.initialRootCount,
      instanceKey: this.props.instanceKey,
      channel: this.props.channel,
      initialData: this.props.initialData,
    });
  }

  componentDidMount() {
    if (this.props.channel) {
      commentSocket.private(this.props.channel);
    }
  }

  componentWillUnmount() {
    this.props.unregisterBundle({
      entityType: this.props.entityType,
      entityId: this.props.entityId,
      instanceKey: this.props.instanceKey,
    });
  }

  getCache = () => getBundleCache(this.props);

  handleCreateComment = ({ htmlContent, parentId }) => {
    const { entityType, entityId, createComment } = this.props;
    const payload = {
      entityType,
      entityId,
      content: htmlContent,
      parentId,
      isReply: Boolean(parentId),
    };
    return createComment(payload);
  };

  handleUpdateComment = ({ id, parentId, htmlContent }) => {
    const { entityType, entityId, updateComment } = this.props;
    const payload = {
      entityType,
      entityId,
      commentId: id,
      parentId,
      content: htmlContent,
    };
    return updateComment(payload);
  };

  handleDeleteComment = (data) => {
    const { entityType, entityId, deleteComment } = this.props;
    const payload = {
      entityType,
      entityId,
      commentId: data.id,
      parentId: data.parentId,
    };
    return deleteComment(payload);
  };

  handleLoadMore = () => {
    const { bundleState, disabled } = this.props;
    if (disabled) {
      return;
    }
    const commentIds = bundleState.comments.map((c) => c.id);
    this.props.fetchComments({
      entityId: this.props.entityId,
      entityType: this.props.entityType,
      excepts: commentIds,
      next: bundleState.next,
    });
  };

  render() {
    const {
      bundleState,
      currentUser,
      entityCapabilities,
      wrapper,
      pageLayout,
      autoFocus,
      showNoContentHint,
      header,
      getCommentCapabilities,
    } = this.props;

    if (!this.props.shouldRender) {
      return null;
    }

    if (!bundleState) {
      return null;
    }

    return (
      <CommentBundle
        wrapper={wrapper}
        entityCapabilities={entityCapabilities}
        bundleState={bundleState}
        cache={this.getCache()}
        currentUser={currentUser}
        onCreateComment={this.handleCreateComment}
        onUpdateComment={this.handleUpdateComment}
        onDeleteComment={this.handleDeleteComment}
        loadMore={this.handleLoadMore}
        pageLayout={pageLayout}
        autoFocus={autoFocus}
        fetchOnMount={this.props.fetchOnMount}
        showCommentForm={this.props.showCommentForm}
        onCommented={this.props.onCommented}
        showNoContentHint={showNoContentHint}
        header={header}
        getCommentCapabilities={getCommentCapabilities}
      />
    );
  }
}

CommonCommentBundle.propTypes = {
  entityCapabilities: PropTypes.shape({
    canComment: PropTypes.bool,
  }),
  disabled: PropTypes.bool, // 控制滚动时是否加载更多
  entityType: PropTypes.any.isRequired,
  entityId: PropTypes.any.isRequired,
  channel: PropTypes.string,
  instanceKey: PropTypes.string,
  bundleState: PropTypes.shape({
    isInitialized: PropTypes.bool,
    comments: PropTypes.array,
    rootCount: PropTypes.number,
  }),
  initialRootCount: PropTypes.number,
  registerBundle: PropTypes.func,
  unregisterBundle: PropTypes.func,
  createComment: PropTypes.func,
  updateComment: PropTypes.func,
  deleteComment: PropTypes.func,
  fetchComments: PropTypes.func,
  currentUser: PropTypes.object,
  wrapper: PropTypes.func,
  pageLayout: PropTypes.bool,
  autoFocus: PropTypes.bool,
  shouldRender: PropTypes.bool,
  showCommentForm: PropTypes.bool,
  showNoContentHint: PropTypes.bool,
  fetchOnMount: PropTypes.bool,
  onCommented: PropTypes.func, // callback
  initialData: PropTypes.array,
  header: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  getCommentCapabilities: PropTypes.func,
};

CommonCommentBundle.defaultProps = {
  shouldRender: true,
};

const mapStateToProps = () =>
  createStructuredSelector({
    bundleState: makeSelectCommentBundle(),
    currentUser: selectCurrentUser,
  });

const mapDispatchToProps = {
  registerBundle,
  unregisterBundle,
  fetchComments: asyncGetCommentTree,
  createComment: asyncCreateComment,
  updateComment: asyncUpdateComment,
  deleteComment: asyncDeleteComment,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(CommonCommentBundle);
