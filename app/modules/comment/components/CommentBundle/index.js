import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import { getAvatar, getUsername } from '@/modules/user/utils';

import Avatar from '@feat/feat-ui/lib/avatar';

import LiveClock from '@/components/LiveClock';
import LoadMoreAnchor from '@/components/LoadMoreAnchor';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { replyKey } from '../../cache';
import { sliceComments, treeToFlatList } from '../../utils';

import CommentForm from '../CommentForm';
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
  };

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
      entityCapabilities: { canComment, commentLimit },
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
      bundleState.comments.filter(
        (c) => c.user && c.user.uid === currentUser.uid,
      ).length >= commentLimit
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
            {header === true ? (
              <TranslatableMessage message={intlMessages.thoughtShare} />
            ) : (
              header
            )}
          </div>
        )}
        <div className="cm-RootCommentForm__wrap">
          <div className="cm-RootCommentForm__avatar">
            <Avatar round avatar={getAvatar(currentUser, 'md')} />
          </div>
          <div className="cm-RootCommentForm__main">
            <div className="cm-RootCommentForm__header">
              <span className="t-username margin_r_5">
                {getUsername(currentUser) || (
                  <TranslatableMessage message={intlMessages.anonymous} />
                )}
              </span>
              <span className="t-meta t-meta_primary">
                {currentUser.expertise}
              </span>
              <span className="t-meta">
                <LiveClock format="HH:mm" ticking />
              </span>
            </div>
            <CommentForm
              className="cm-Typo"
              autoFocus={autoFocus}
              onSubmit={this.handleCreateComment}
              showUserInfo={false}
              initialContent={cache.get(replyKey(null))}
              updateCache={(data) => {
                this.setCache(replyKey(null), data);
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
      showAvatar,
      intl: { formatMessage },
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
        <div className="cm-CommentSections cm-CommentSections_page">
          {slices.map((slice, index) => {
            const [items, lineCount] = slice;
            return (
              <div
                className={classNames('cm-CommentSectionStack', {
                  'is-multi': lineCount > 32, // 估算行高大于一页， 只是预估值，可能会造成第二页没有页码的情况，或者第二页只有页码的情况
                  'has-avatar': showAvatar,
                })}
                key={index}
              >
                <div className="cm-CommentSectionStack__content">
                  {items.map((comment) => (
                    <CommentSection
                      escapeChildren
                      showAvatar={showAvatar}
                      maxReplyLimit={entityCapabilities.maxReplyLimit}
                      reachMaxReplyHint={formatMessage(
                        intlMessages.reachMaxReplyLimitHint,
                      )}
                      hasReplyHint={formatMessage(intlMessages.hasReplyHint)}
                      replyCache={cache.get(replyKey(comment.id))}
                      updateReplyCache={(data) => {
                        this.setCache(replyKey(comment.id), data);
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
                </div>
                <div className="cm-CommentSectionStack__footer" />
              </div>
            );
          })}
        </div>
      </>
    );
  }

  renderCommentSections() {
    const {
      bundleState: { comments },
      currentUser,
      entityCapabilities,
      cache,
      showAvatar,
      intl: { formatMessage },
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
            hasReplyHint={formatMessage(intlMessages.hasReplyHint)}
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
            showAvatar={showAvatar}
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
            !entityCapabilities.canComment &&
            showNoContentHint && (
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
  autoFocus: PropTypes.bool,
  pageLayout: PropTypes.bool,
  showCommentForm: PropTypes.bool,
  isComment: PropTypes.bool,
  showSectionHeader: PropTypes.bool,
  showNoContentHint: PropTypes.bool,
  showAvatar: PropTypes.bool,
  fetchOnMount: PropTypes.bool,
  header: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  entityCapabilities: PropTypes.shape({
    canComment: PropTypes.bool,
    maxReplyLimit: PropTypes.number,
    commentLimit: PropTypes.number,
  }),
  bundleState: PropTypes.shape({
    isInitialized: PropTypes.bool,
    comments: PropTypes.array,
    rootCount: PropTypes.number,
    isFetchingComments: PropTypes.bool,
  }),
  cache: PropTypes.object,
  currentUser: PropTypes.shape({
    username: PropTypes.string,
    uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    avatar: PropTypes.string,
    expertise: PropTypes.string,
  }),
  wrapper: PropTypes.func,
  getCommentCapabilities: PropTypes.func,
  onCommented: PropTypes.func,
  // authorize: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,
  onCreateComment: PropTypes.func.isRequired,
  onUpdateComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,

  intl: PropTypes.object,
};

CommentBundle.defaultProps = {
  entityCapabilities: {},
  pageLayout: true,
  showCommentForm: true,
  showSectionHeader: true,
  showNoContentHint: true,
  header: true,
  showAvatar: true,
};

export default injectIntl(CommentBundle, { forwardRef: true });
