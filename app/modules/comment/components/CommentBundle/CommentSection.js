import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';
import Link from 'next/link';

import { formatDate } from '@/utils/time';
import { getAvatar, getUsername } from '@/utils/user';

import Comment from '@feat/feat-ui/lib/comment';
import message from '@feat/feat-ui/lib/message';
import { Row, Col } from '@feat/feat-ui/lib/grid';
import Avatar from '@feat/feat-ui/lib/avatar';
import Button from '@feat/feat-ui/lib/button';
import SvgIcon from '@feat/feat-ui/lib/svg-icon';

import SimpleForm from '@/components/SimpleForm';


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
          <SimpleForm
            submitButtonText="OK"
            typoClassName='typo-comment'
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
        className: 'js-clickable',
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
    const { currentUser, comment, maxReplyLimit, reachMaxReplyHint } = this.props;
    if (maxReplyLimit &&
      comment.children &&
      comment.children.filter((item) => get(item, 'user.uid', item.user_id) === currentUser.uid).length >= maxReplyLimit
    ) {
      message.info(reachMaxReplyHint)
      return;
    }
    this.setState((prevState) => ({
      isReplyOpened: !prevState.isReplyOpened,
    }));
  };

  cancelReply = () => {
    this.setState({
      isReplyOpened: false,
    })
  }

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
    const { comment } = this.props;
    if (this.state.isEditModeEnabled) {
      return;
    }
    const capabilities = this.getCapabilities();
    if (capabilities.canEdit && !hasReply(comment)) {
      this.enterEditMode();
    } else if (capabilities.canReply) {
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
    })
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
    })
  };

  handleDelete = () => {
    const { comment, onDelete } = this.props;
    // handle error in form component
    return onDelete({
      id: comment.id,
      parentId: comment.parent_id,
    })
  };

  renderReplyForm() {
    if (!this.state.isReplyOpened) {
      return null;
    }
    const { currentUser, comment, replyCache } = this.props;
    return (
      <SimpleForm
        typoClassName='typo-comment'
        avatar={
          <Avatar
            size="sm"
            avatar={getAvatar(currentUser, 'md')}
            username={getUsername(currentUser)}
            round
          />
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
    const { comment, parentInfo } = this.props;
    const { user: author = {} } = comment;
    const contentProps = this.getContentProps();
    return (
      <Comment modifier="subComment" className={classNames('margin_y_12')}>
        <Row flex>
          <Comment.Avatar>
            <Avatar
              round
              avatar={getAvatar(author, 'md')}
              username={getUsername(author)}
            />
          </Comment.Avatar>
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
                  <a>
                    {getUsername(author)}
                  </a>
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
                  <a>
                    {getUsername(parentInfo.author)}
                  </a>
                </Link>
              </Comment.Author>
              <Comment.Meta>
                {formatDate(comment.updated_at || comment.last_modified)}
              </Comment.Meta>
            </Comment.Header>
            <Comment.Content
              className="typo-comment"
              data-id={comment.id}
              {...contentProps}
            />
          </Col>
        </Row>
      </Comment>
    );
  }

  renderComment() {
    const { comment } = this.props;
    const { user: author = {} } = comment;

    const contentProps = this.getContentProps();
    return (
      <Comment className={classNames('margin_y_12')}>
        <div className="margin_b_5">
          <Comment.Meta>
            {formatDate(comment.updated_at || comment.last_modified)}
          </Comment.Meta>
        </div>
        <Row flex>
          <Comment.Avatar>
            <Avatar
              round
              size="sm"
              avatar={getAvatar(author, 'md')}
              username={getUsername(author)}
            />
          </Comment.Avatar>
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
                <a>
                  {getUsername(author)}
                </a>
              </Link>
            </Comment.Author>
            <Comment.Desc>{author.expertise}</Comment.Desc>
            <Comment.Content
              className="typo-comment"
              data-id={comment.id}
              {...contentProps}
            />
          </Col>
        </Row>
        {comment.children &&
          !!comment.children.length && (
          <Button
            className="Comment__btn"
            onClick={this.handleClick}
            style={{ display: 'none' }}
          >
            <SvgIcon icon="comment" />
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

CommentSection.propTypes = {
  className: PropTypes.string,
  isRootComment: PropTypes.bool,
  escapeChildren: PropTypes.bool,
  comment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    content: PropTypes.string,
    capabilities: PropTypes.object,
  }),
  parentInfo: PropTypes.shape({
    author: PropTypes.object,
  }),
  currentUser: PropTypes.shape({
    uesrname: PropTypes.string,
    avatar: PropTypes.string,
    uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onUpdate: PropTypes.func,
  onReply: PropTypes.func,
  onDelete: PropTypes.func,
  getCapabilities: PropTypes.func,
  maxReplyLimit: PropTypes.number,
  reachMaxReplyHint: PropTypes.string,
  updateReplyCache: PropTypes.func,
  replyCache: PropTypes.string,
  // infoExtractor: PropTypes.func,
};

CommentSection.defaultProps = {
  isRootComment: false,
  escapeChildren: false,
  reachMaxReplyHint: 'Max Reply Reach',
  // infoExtractor: () => ({}),
};

export default CommentSection;
