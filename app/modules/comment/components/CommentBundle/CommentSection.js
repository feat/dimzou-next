import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';
import Link from 'next/link';

import { formatDate } from '@/utils/time';
import { getAvatar, getUsername } from '@/modules/user/utils';

import Comment from '@feat/feat-ui/lib/comment';
import message from '@feat/feat-ui/lib/message';
import { Row, Col } from '@feat/feat-ui/lib/grid';
import Avatar from '@feat/feat-ui/lib/avatar';
import Button from '@feat/feat-ui/lib/button';

import CommentIcon from '../CommentIcon';
import CommentForm from '../CommentForm';

function hasReply(comment) {
  if (!comment.children) {
    return false;
  }
  if (comment.children && comment.children.length === 0) {
    return false;
  }
  return true;
}

class CommentSection extends React.Component {
  state = {
    isReplyOpened: !!this.props.replyCache,
    isReplyListOpened: true,
    isEditModeEnabled: false,
  };

  getContentProps() {
    const { isEditModeEnabled } = this.state;
    const { comment } = this.props;
    const htmlContents = comment.content.replace(/<p><br\s*\/?><\/p>/g, '');
    const contentProps = isEditModeEnabled
      ? {
          children: (
            <CommentForm
              submitButtonText="OK"
              typoClassName="cm-Typo"
              canCancel
              canDelete
              autoFocus
              showUserInfo={false}
              baseContent={comment.content}
              initialContent={comment.content}
              onSubmit={this.handleUpdateSubmit}
              onCancel={this.exitEditMode}
              onDelete={this.handleDelete}
            />
          ),
        }
      : {
          dangerouslySetInnerHTML: { __html: htmlContents },
          onClick: this.handleContentClick,
          className: 'js-clickable cm-Typo',
          'data-id': comment.id,
        };
    return contentProps;
  }

  getCapabilities() {
    const { comment, getCapabilities, currentUser } = this.props;
    if (comment.capabilities) {
      return comment.capabilities;
    }
    if (getCapabilities) {
      return getCapabilities(comment, currentUser);
    }

    const commentUserId = comment.user_id || get(comment, 'user.uid');
    return {
      canEdit: commentUserId === currentUser.uid,
      canReply: commentUserId !== currentUser.uid,
    };
  }

  toggleReply = () => {
    const {
      currentUser,
      comment,
      maxReplyLimit,
      reachMaxReplyHint,
    } = this.props;
    if (
      maxReplyLimit &&
      comment.children &&
      comment.children.filter(
        (item) => get(item, 'user.uid', item.user_id) === currentUser.uid,
      ).length >= maxReplyLimit
    ) {
      message.info(reachMaxReplyHint);
      return;
    }
    this.setState((prevState) => ({
      isReplyOpened: !prevState.isReplyOpened,
    }));
  };

  cancelReply = () => {
    this.setState({
      isReplyOpened: false,
    });
  };

  enterEditMode = () => {
    this.setState({
      isEditModeEnabled: true,
    });
  };

  exitEditMode = () => {
    this.setState({
      isEditModeEnabled: false,
    });
  };

  handleContentClick = () => {
    const { comment, hasReplyHint } = this.props;
    if (this.state.isEditModeEnabled) {
      return;
    }
    const capabilities = this.getCapabilities();
    if (capabilities.canEdit && hasReply(comment)) {
      message.info(hasReplyHint);
    } else if (capabilities.canEdit && !hasReply(comment)) {
      this.enterEditMode();
    } else if (capabilities.canReply) {
      // check if user is selecting text.
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        return;
      }
      this.toggleReply();
    }
  };

  handleReplySubmit = (content) => {
    const { onReply, comment } = this.props;
    // handle error in form component
    return onReply({
      ...content,
      parentId: comment.id,
    }).then(() => {
      this.setState({
        isReplyOpened: false,
      });
    });
  };

  handleUpdateSubmit = (content) => {
    const { onUpdate, comment } = this.props;
    // handle error in form component
    return onUpdate({
      ...content,
      id: comment.id,
      parentId: comment.parent_id,
    }).then(() => {
      this.setState({
        isEditModeEnabled: false,
      });
    });
  };

  handleDelete = () => {
    const { comment, onDelete } = this.props;
    // handle error in form component
    return onDelete({
      id: comment.id,
      parentId: comment.parent_id,
    });
  };

  renderReplyForm() {
    if (!this.state.isReplyOpened) {
      return null;
    }
    const { currentUser, comment, replyCache, showAvatar } = this.props;
    return (
      <CommentForm
        typoClassName="cm-Typo"
        avatar={
          showAvatar && (
            <Avatar
              size="sm"
              avatar={getAvatar(currentUser, 'md')}
              username={getUsername(currentUser)}
              round
            />
          )
        }
        initialContent={replyCache}
        updateCache={this.props.updateReplyCache}
        username={getUsername(currentUser)}
        commentUser={getUsername(comment.user)}
        className="padding_r_12"
        onSubmit={this.handleReplySubmit}
        autoFocus
        onEmptyContentBlur={this.cancelReply}
      />
    );
  }

  renderReplies() {
    const {
      comment: { children, user, id },
      currentUser,
      onUpdate,
      onDelete,
      onReply,
      getCapabilities,
    } = this.props;
    const { isReplyListOpened } = this.state;
    if (!isReplyListOpened || !children || children.length === 0) {
      return null;
    }

    return (
      <div
        ref={(n) => {
          this.reply = n;
        }}
      >
        <Comment.List noIndent className="cm-CommentList">
          {children.map((subComment) => (
            <CommentSection
              parentInfo={{ author: user, id }}
              comment={subComment}
              key={subComment.id}
              currentUser={currentUser}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onReply={onReply}
              getCapabilities={getCapabilities}
            />
          ))}
        </Comment.List>
      </div>
    );
  }

  renderSubComment() {
    const { comment, parentInfo, showAvatar } = this.props;
    const { user: author = {} } = comment;
    const contentProps = this.getContentProps();
    return (
      <Comment modifier="subComment" className={classNames('margin_b_12')}>
        <Row flex>
          {showAvatar && (
            <Comment.Avatar>
              <Avatar
                round
                avatar={getAvatar(author, 'md')}
                username={getUsername(author)}
              />
            </Comment.Avatar>
          )}
          <Col auto>
            <Comment.Header>
              <Comment.Author>
                <Link
                  href={{
                    pathname: '/user-profile',
                    query: {
                      userId: author.uid,
                    },
                  }}
                  as={`/profile/${author.uid}`}
                >
                  <a>{getUsername(author)}</a>
                </Link>
              </Comment.Author>
              <span className="margin_r_5">››</span>
              <Comment.Author>
                <Link
                  href={{
                    pathname: '/user-profile',
                    query: {
                      userId: parentInfo.author.uid,
                    },
                  }}
                  as={`/profile/${parentInfo.author.uid}`}
                >
                  <a>{getUsername(parentInfo.author)}</a>
                </Link>
              </Comment.Author>
              <Comment.Meta>
                {formatDate(comment.updated_at || comment.last_modified)}
              </Comment.Meta>
            </Comment.Header>
            <Comment.Content {...contentProps} />
          </Col>
        </Row>
      </Comment>
    );
  }

  renderComment() {
    const { comment, showAvatar } = this.props;
    const { user: author = {} } = comment;

    const contentProps = this.getContentProps();
    return (
      <Comment className={classNames('margin_b_12')}>
        <div className="margin_b_5">
          <Comment.Meta>
            {formatDate(comment.updated_at || comment.last_modified)}
          </Comment.Meta>
        </div>
        <Row flex>
          {showAvatar && (
            <Comment.Avatar>
              <Avatar
                round
                size="sm"
                avatar={getAvatar(author, 'md')}
                username={getUsername(author)}
              />
            </Comment.Avatar>
          )}
          <Col auto>
            <Comment.Author>
              <Link
                href={{
                  pathname: '/user-profile',
                  query: {
                    userId: author.uid,
                  },
                }}
                as={`/profile/${author.uid}`}
              >
                <a>{getUsername(author)}</a>
              </Link>
            </Comment.Author>
            <Comment.Desc>{author.expertise}</Comment.Desc>
            <Comment.Content {...contentProps} />
          </Col>
        </Row>
        {comment.children &&
          !!comment.children.length && (
            <Button
              className="Comment__btn"
              onClick={this.handleClick}
              style={{ display: 'none' }}
            >
              <CommentIcon className="size_16" />
            </Button>
          )}
      </Comment>
    );
  }

  handleClick = () => {
    const f = this.reply.style.display === 'none';
    if (f) {
      this.reply.style.display = 'block';
    } else {
      this.reply.style.display = 'none';
    }
  };

  render() {
    const { isRootComment, className, escapeChildren } = this.props;
    return (
      <Comment.Wrap
        className={classNames(
          'cm-CommentSection',
          className,
          isRootComment ? 'cm-CommentSection_root' : 'cm-CommentSection_sub',
        )}
      >
        {isRootComment ? this.renderComment() : this.renderSubComment()}
        {this.renderReplyForm()}
        {!escapeChildren && this.renderReplies()}
      </Comment.Wrap>
    );
  }
}

const userPropsTypes = PropTypes.shape({
  author: PropTypes.shape({
    uesrname: PropTypes.string,
    avatar: PropTypes.string,
    uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
});

CommentSection.propTypes = {
  className: PropTypes.string,
  isRootComment: PropTypes.bool,
  escapeChildren: PropTypes.bool,
  showAvatar: PropTypes.bool,
  comment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    content: PropTypes.string,
    user: userPropsTypes,
    capabilities: PropTypes.object,
  }),
  parentInfo: userPropsTypes,
  currentUser: userPropsTypes,
  onUpdate: PropTypes.func,
  onReply: PropTypes.func,
  onDelete: PropTypes.func,
  getCapabilities: PropTypes.func,
  maxReplyLimit: PropTypes.number,
  reachMaxReplyHint: PropTypes.string,
  hasReplyHint: PropTypes.string,
  updateReplyCache: PropTypes.func,
  replyCache: PropTypes.string,
  // infoExtractor: PropTypes.func,
};

CommentSection.defaultProps = {
  isRootComment: false,
  escapeChildren: false,
  reachMaxReplyHint: 'Max Reply Reach',
  hasReplyHint: 'Has Replied', // 已被回复不能编辑
  // infoExtractor: () => ({}),
};

export default CommentSection;
