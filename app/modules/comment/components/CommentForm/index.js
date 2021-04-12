/**
 * 评论表单
 * 功能：
 *  - 可以设置加载后自动获得焦点
 *  - 在失去焦点后，会触发 emptyContentBlur
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '@feat/feat-ui/lib/button';
import Comment from '@feat/feat-ui/lib/comment';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import notification from '@feat/feat-ui/lib/notification';

import { EditorState } from '@feat/draft-js';

import {
  Editor,
  createEmpty,
  createWithContent,
  contentStateFromHTML,
  contentStateToHTML,
} from '@feat/feat-editor';

import ActionButton from '@/components/ActionButton';

import { handlePastedText } from '@/utils/editor';

import './style.scss';

const createWithHTML = (html) =>
  EditorState.moveFocusToEnd(createWithContent(contentStateFromHTML(html)));

class CommentForm extends React.Component {
  state = {
    editorState: this.props.initialContent
      ? createWithHTML(this.props.initialContent)
      : createEmpty(),
  };

  componentDidMount() {
    if (this.props.autoFocus && this.editor) {
      this.editor.focus();
    }
    this.customIsMounted = true; // eslint-disable-line
  }

  componentWillUnmount() {
    this.customIsMounted = false;
  }

  getOutput() {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const contents = contentState
      .getBlockMap()
      .map((block) => block.getText())
      .join('\n');
    const htmlContents = contentStateToHTML(contentState);
    const content = contents.trim();
    const htmlContent = htmlContents.replace(/<p><br\s*\/?><\/p>/g, '');
    return {
      content,
      htmlContent,
    };
  }

  reset() {
    this.setState({
      editorState: createEmpty(),
      isSubmitting: false,
      isDeleting: false,
    });
  }

  hasValidContent() {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    return contentState.hasText();
  }

  handleEditor = (editorState) => {
    this.setState({ editorState }, () => {
      const data = this.getOutput();
      this.updateCache(data);
    });

    if (this.state.submitError) {
      this.setState({ submitError: null });
    }
  };

  updateCache = (data) => {
    if (this.props.updateCache) {
      this.props.updateCache(data);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const data = this.getOutput();
    if (this.props.baseContent && data.htmlContent === this.props.baseContent) {
      this.props.onCancel(data);
      return;
    }
    this.setState({ isSubmitting: true });
    const promise = this.props.onSubmit(data);
    if (promise) {
      promise
        .then(() => {
          if (this.customIsMounted) {
            this.reset();
          }
        })
        .catch((err) => {
          this.setState({
            submitError: err,
          });
          this.setState({
            isSubmitting: false,
          });
          if (err.code && err.code !== 'VALIDATION_EXCEPTION') {
            notification.error({
              message: 'Error',
              description: err.message,
            });
          }
        });
    }
  };

  handleDelete = (e) => {
    e.preventDefault();
    this.setState({
      isDeleting: true,
    });
    const promise = this.props.onDelete();
    if (promise) {
      promise
        .then(() => {
          if (this.customIsMounted) {
            this.reset();
          }
        })
        .catch(() => {
          this.setState({
            isDeleting: false,
          });
        });
    }
  };

  handleCancel = (e) => {
    e.preventDefault();
    const data = this.getOutput();
    this.props.onCancel(data);
  };

  handleEditorFocus = () => {
    // TODO: may reset timer;
    logging.debug('FOCUS');
  };

  handleEditorBlur = () => {
    if (
      !this.state.editorState.getCurrentContent().hasText() &&
      this.props.onEmptyContentBlur
    ) {
      this.props.onEmptyContentBlur();
    }
  };

  renderPrimaryButton() {
    const { deleteButtonText, submitButtonText } = this.props;
    const hasValidContent = this.hasValidContent();
    if (this.props.canDelete && !hasValidContent) {
      return (
        <Button
          className="cm-CommentForm__delete"
          type="danger"
          onClick={this.handleDelete}
          disabled={this.state.isDeleting}
        >
          {deleteButtonText}
        </Button>
      );
    }

    return (
      <ActionButton
        type="ok"
        htmlType="submit"
        className={classNames({
          'is-invisible': !hasValidContent,
        })}
        disabled={!hasValidContent || this.state.isSubmitting}
      >
        {submitButtonText}
      </ActionButton>
    );
  }

  renderSubmitError() {
    const { submitError } = this.state;
    return (
      <FormHelp
        validateStatus="error"
        data={
          submitError.code === 'VALIDATION_EXCEPTION'
            ? submitError.data
            : submitError.message
        }
      />
    );
  }

  render() {
    const {
      placeholder,
      className,
      avatar,
      cancelButtonText,
      username,
      commentUser,
      showUserInfo,
      typoClassName,
    } = this.props;
    return (
      <form
        className={classNames('cm-CommentForm', className)}
        onSubmit={this.handleSubmit}
      >
        {avatar && <div className="cm-CommentForm__avatar">{avatar}</div>}
        <Comment style={{ width: '100%' }}>
          {showUserInfo && (
            <div>
              <Comment.Author>{username}</Comment.Author>
              <span className="margin_r_5">››</span>
              <Comment.Author>{commentUser}</Comment.Author>
            </div>
          )}
          <div className="cm-CommentForm__main">
            <Editor
              ref={(c) => {
                this.editor = c;
              }}
              handlePastedText={handlePastedText}
              editorState={this.state.editorState}
              className={classNames('cm-CommentForm__input', typoClassName)}
              placeholder={placeholder}
              onChange={this.handleEditor}
              onBlur={this.handleEditorBlur}
              onFocus={this.handleEditorFocus}
            />
            <div className="cm-CommentForm__footer">
              <div className="cm-CommentForm__footerHint">
                <span className="cm-CommentForm__hint">{this.props.hint}</span>
              </div>
              <div className="cm-CommentForm__actions">
                {this.props.canCancel && (
                  <ActionButton
                    type="no"
                    className="margin_r_12"
                    onClick={this.handleCancel}
                  >
                    {cancelButtonText}
                  </ActionButton>
                )}
                {this.renderPrimaryButton()}
              </div>
            </div>
          </div>
          {this.state.submitError && this.renderSubmitError()}
        </Comment>
      </form>
    );
  }
}

CommentForm.propTypes = {
  className: PropTypes.string,
  typoClassName: PropTypes.string,
  baseContent: PropTypes.string,
  initialContent: PropTypes.string,
  showUserInfo: PropTypes.bool,
  avatar: PropTypes.node,
  hint: PropTypes.node,
  placeholder: PropTypes.node,
  submitButtonText: PropTypes.node,
  cancelButtonText: PropTypes.node,
  deleteButtonText: PropTypes.node,
  username: PropTypes.node,
  commentUser: PropTypes.node, // reply to
  autoFocus: PropTypes.bool,
  canCancel: PropTypes.bool,
  canDelete: PropTypes.bool,
  updateCache: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onEmptyContentBlur: PropTypes.func,
};

CommentForm.defaultProps = {
  showUserInfo: true,
  placeholder: 'Type here',
  deleteButtonText: 'Delete',
};

export default CommentForm;
