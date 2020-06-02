import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { formatMessage } from '@/services/intl';
import { getAvatar, getUsername } from '@/utils/user';
import { sliceComments, treeToFlatList } from '@/utils/comment';

import Avatar from '@feat/feat-ui/lib/avatar';
import { Row, Col } from '@feat/feat-ui/lib/grid';
import SimpleForm from '@/components/SimpleForm';
import Username from '@/components/Username';
import Meta from '@/components/Meta';
import LiveClock from '@/components/LiveClock';
import LoadMoreAnchor from '@/components/LoadMoreAnchor';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import { replyKey } from '../../cache';

import CommentSection from './CommentSection';
import intlMessages from './messages';
import './style.scss';

class CommentBundle extends React.Component {
  componentDidMount() {
    if (this.props.fetchOnMount) {
      this.props.loadMore();
    }
  }

  setCache = (key, data = {}) => {
    this.props.cache.set(key, data.content ? data.htmlContent : '');
    this.forceUpdate();
  }

  hasNoContent = () => {
    const { entityCapabilities, bundleState } = this.props;
    return (
      bundleState &&
      !entityCapabilities.canComment &&
      !bundleState.rootCount &&
      (!bundleState.comments || !bundleState.comments.length)
    );
  };

  handleCreateComment = (data) =>
    this.props.onCreateComment(data).then(this.triggerCommented);

  handleUpdateComment = (data) => this.props.onUpdateComment(data);

  handleDeleteComment = (data) => this.props.onDeleteComment(data);

  triggerCommented = (data) => {
    // when user is not logined, data is undefined;
    if (!data) {
      return data;
    }
    if (this.props.onCommented) {
      this.props.onCommented(data);
    }
    this.setCache(replyKey(data.parentId || null), {});
    return data;
  };

  renderCommentForm() {
    const {
      currentUser,
      entityCapabilities: {
        canComment,
        commentLimit,
      },
      autoFocus,
      showCommentForm,
      cache,
      isComment,
      bundleState,
      header,
    } = this.props;
    if (!canComment) {
      return null;
    }
    // user has commented;
    if (
      commentLimit && 
      bundleState.comments.filter((c) => c.user && c.user.uid === currentUser.uid).length >= commentLimit
    ) {
      return null;
    }
    if (!showCommentForm) {
      return null;
    }
    if (isComment) {
      return null;
    }
    return (
      <div className="cm-RootCommentForm">
        {header && (
          <div className="cm-RootCommentForm__note">
            {header === true ? <TranslatableMessage message={intlMessages.thoughtShare} /> : header}
          </div>  
        )}
        <div className="cm-RootCommentForm__wrap">
          <div className="cm-RootCommentForm__avatar">
            <Avatar round avatar={getAvatar(currentUser, 'md')} />
          </div>
          <div className="cm-RootCommentForm__main">
            <div className="cm-RootCommentForm__header">
              <Username>
                {getUsername(currentUser) || <TranslatableMessage message={intlMessages.anonymous} />}
              </Username>
              <Meta>{currentUser.expertise}</Meta>
              <Meta>
                <LiveClock format="HH:mm" ticking />
              </Meta>
            </div>
            <SimpleForm
              className="typo-comment"
              autoFocus={autoFocus}
              onSubmit={this.handleCreateComment}
              showUserInfo={false}
              initialContent={cache.get(replyKey(null))}
              updateCache={(data) => { 
                this.setCache(replyKey(null), data)
              }}
              placeholder={
                <TranslatableMessage message={intlMessages.placeholder} />
              }
            />
          </div>
        </div>
      </div>
    );
  }

  renderCommentWithPageLayout() {
    const {
      bundleState: { comments },
      cache,
      currentUser,
      entityCapabilities,
      showSectionHeader,
    } = this.props;
    if (comments.length === 0) {
      return null;
    }
    const flatCommentList = treeToFlatList(comments);
    const slices = sliceComments(flatCommentList);
    return (
      <>
        {showSectionHeader && (
          <div className="cm-CommentBundle__sectionHeader">
            <TranslatableMessage message={intlMessages.opinions} />
          </div>
        )}
        <Row flex wrap className="cm-CommentSections">
          {slices.map((slice, index) => (
            <Col className="cm-CommentSections__cell" span={12} key={index}>
              {slice[0].map((comment) => (
                <CommentSection
                  escapeChildren
                  maxReplyLimit={entityCapabilities.maxReplyLimit}
                  reachMaxReplyHint={formatMessage(
                    intlMessages.reachMaxReplyLimitHint,
                  )}
                  replyCache={cache.get(replyKey(comment.id))}
                  updateReplyCache={(data) => {
                    this.setCache(replyKey(comment.id), data)
                  }}
                  key={comment.id}
                  comment={comment}
                  parentInfo={comment.parentInfo}
                  isRootComment={!comment.parent_id}
                  currentUser={currentUser}
                  onReply={this.handleCreateComment}
                  onUpdate={this.handleUpdateComment}
                  onDelete={this.handleDeleteComment}
                  getCapabilities={this.props.getCommentCapabilities}
                />
              ))}
            </Col>
          ))}
        </Row>
      </>
    );
  }

  renderCommentSections() {
    const {
      bundleState: { comments },
      currentUser,
      entityCapabilities,
      cache,
    } = this.props;
    return (
      <div className="cm-CommentSections">
        {comments.map((comment) => (
          <CommentSection
            key={comment.id}
            comment={comment}
            maxReplyLimit={entityCapabilities.maxReplyLimit}
            reachMaxReplyHint={formatMessage(
              intlMessages.reachMaxReplyLimitHint,
            )}
            isRootComment
            replyCache={cache.get(replyKey(comment.id))}
            updateReplyCache={(data) => {
              this.setCache(replyKey(comment.id), data);
            }}
            currentUser={currentUser}
            onReply={this.handleCreateComment}
            onUpdate={this.handleUpdateComment}
            onDelete={this.handleDeleteComment}
            getCapabilities={this.props.getCommentCapabilities}
          />
        ))}
      </div>
    );
  }

  renderLoadMoreAnchor() {
    const {
      bundleState: { comments, rootCount, isFetchingComments },
      loadMore,
    } = this.props;
    if (comments.length >= rootCount) {
      return null;
    }
    return (
      <LoadMoreAnchor
        loading={isFetchingComments}
        loadMore={loadMore}
        immediately
      />
    );
  }

  render() {
    const {
      bundleState,
      style,
      className,
      wrapper,
      entityCapabilities,
      showNoContentHint,
    } = this.props;

    let content;
    if (!bundleState || !bundleState.isInitialized) {
      content = (
        <div>
          <TranslatableMessage message={intlMessages.loading} />
        </div>
      );
    } else {
      const hasNoContent = this.hasNoContent();
      content = (
        <div
          className={classNames('cm-CommentBundle', className, {
            'no-content': hasNoContent,
          })}
          style={style}
        >
          {hasNoContent &&
            !entityCapabilities.canComment && showNoContentHint && (
            <div className="cm-CommentBundle__noContentHint">
              <TranslatableMessage message={intlMessages.noContentHint} />
            </div>
          )}
          {this.renderCommentForm()}
          {this.props.pageLayout
            ? this.renderCommentWithPageLayout()
            : this.renderCommentSections()}
          {this.renderLoadMoreAnchor()}
        </div>
      );
    }

    if (!wrapper) {
      return content;
    }
    return wrapper(bundleState, content);
  }
}

CommentBundle.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  entityCapabilities: PropTypes.shape({
    canComment: PropTypes.bool,
    maxReplyLimit: PropTypes.number,
    commentLimit: PropTypes.number,
  }),
  bundleState: PropTypes.shape({
    isInitialized: PropTypes.bool,
    comments: PropTypes.array,
  }),
  cache: PropTypes.object,
  loadMore: PropTypes.func.isRequired,
  onCreateComment: PropTypes.func.isRequired,
  onUpdateComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    username: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    avatar: PropTypes.string,
    expertise: PropTypes.string,
  }),
  autoFocus: PropTypes.bool,
  pageLayout: PropTypes.bool,
  wrapper: PropTypes.func,
  getCommentCapabilities: PropTypes.func,
  showCommentForm: PropTypes.bool,
  onCommented: PropTypes.func,
  fetchOnMount: PropTypes.bool,
  // authorize: PropTypes.func.isRequired,
  isComment: PropTypes.bool,
  showSectionHeader: PropTypes.bool,
  showNoContentHint: PropTypes.bool,
  header: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.node,
  ]),
};

CommentBundle.defaultProps = {
  entityCapabilities: {},
  pageLayout: true,
  showCommentForm: true,
  showSectionHeader: true,
  showNoContentHint: true,
  header: true,
};

export default CommentBundle;
