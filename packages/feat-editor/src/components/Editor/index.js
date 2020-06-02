import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Editor, RichUtils } from 'draft-js';
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';

import { BLOCK_TYPE, ENTITY_TYPE, HANDLED, NOT_HANDLED } from '../../constants';

import _isHandled from '../../utils/isHandled';

import handleReturn from '../../handlers/handleReturn';
import handleKeyCommand from '../../handlers/handleKeyCommand';
import handleBeforeInput from '../../handlers/handleBeforeInput';
import handlePastedText from '../../handlers/handlePastedText';
import handleToggleBlockType from '../../handlers/handleToggleBlock';
import handleToggleInlineStyle from '../../handlers/handleToggleInlineStyle';
import keyBindingFn from '../../handlers/keyBindingFn';

import appendAtomicBlock from '../../utils/appendAtomicBlock';
import moveBlock from '../../utils/moveBlock';

import CodeBlock from '../../plugins/CodeBlock/component/CodeBlock';
import AtomicBlock from '../../components/AtomicBlock';

import blockStyleFn from '../../model/blockStyleFn';
import blockInSelection from '../../utils/blockInSelection';
// import UploadManager from '../../plugins/FileUpload/manager';
import uploadManager from '../../plugins/FileUpload';

class FeatEditor extends Component {
  constructor(props) {
    super(props);
    this.dragCounter = 0;
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.handleBeforeInput = this._handleBeforeInput.bind(this);
    this.handlePastedText = this._handlePastedText.bind(this);
    this.handleBeforeCut = this._handleBeforeCut.bind(this);
    this.handleReturn = this._handleReturn.bind(this);
    this.handleDrop = this._handleDrop.bind(this);
    this.handleDroppedFiles = this._handleDroppedFiles.bind(this);
    this.handleToggleBlockType = this._handleToggleBlockType.bind(this);
    this.handleToggleInlineStyle = this._handleToggleInlineStyle.bind(this);
    this.onBlur = this._onBlur.bind(this);
    this.onTab = this._onTab.bind(this);

    this.getEditorState = this.getEditorState.bind(this);
    this.setEditorState = this.setEditorState.bind(this);
    this.isReadOnly = this.isReadOnly.bind(this);
    this.setReadOnly = this.setReadOnly.bind(this);

    this.blockRendererFn = this.blockRendererFn.bind(this);

    this.state = this.getInitState();
    if (this.props.uploadFiles) {
      this.uploadManagerKey = uploadManager.registerTaskCreator(
        this.props.uploadFiles,
      );
    }
  }
  componentDidMount() {
    const dragHint = document.createElement('div');
    dragHint.classList.add('DraftEditor-dragHint');
    this.dragHint = dragHint;
    if (this.props.autoFocus) {
      this.editorNode.focus();
    }
  }
  componentDidUpdate() {
    if (this.forceSyncWindowSelection) {
      const { editorState } = this.props;
      const selectionKey = editorState.getSelection().getAnchorKey();
      const offsetKey = DraftOffsetKey.encode(selectionKey, 0, 0);
      const node = document.querySelectorAll(`[data-offset-key="${offsetKey}"]`)[0];
      if (!node) {
        this.forceSyncWindowSelection = false;
        return;
      }
      // set the native selection to the node so the caret is not in the text and
      // the selectionState matches the native selection
      const selection = window.getSelection();
      const range = document.createRange();
      range.setStart(node, 0);
      range.setEnd(node, 0);
      selection.removeAllRanges();
      selection.addRange(range);
      this.forceSyncWindowSelection = false;
    }
  }
  getInitState() {
    return {
      readOnly: Boolean(this.props.readOnly),
    };
  }
  getEditorState() {
    return this.props.editorState;
  }
  getUploadManager() {
    return this.uploadManager;
  }
  setEditorState(editorState) {
    this.props.onChange(editorState);
  }
  setReadOnly(readOnly) {
    this.setState({ readOnly });
  }
  isReadOnly() {
    return this.state.readOnly;
  }
  blockRendererFn(contentBlock) {
    const blockType = contentBlock.getType();
    const { setEditorState, getEditorState, setReadOnly, isReadOnly } = this;
    let isFocused;
    switch (blockType) {
      case BLOCK_TYPE.CODE_BLOCK:
        return {
          component: CodeBlock,
          editable: true,
          props: {
            setEditorState,
            getEditorState,
            setReadOnly,
            isReadOnly,
          },
        };
      case BLOCK_TYPE.ATOMIC:
        isFocused = blockInSelection(getEditorState(), contentBlock.getKey());
        return {
          component: AtomicBlock,
          editable: false,
          props: {
            uploadManager,
            setEditorState,
            getEditorState,
            setReadOnly,
            isReadOnly,
            isFocused,
          },
        };
      default:
        return null;
    }
  }
  focus() {
    this.editorNode.focus();
  }
  blur() {
    this.editorNode.blur();
  }
  ref = (node) => {
    this.editorNode = node;
  }
  _handleKeyCommand(command) {
    if (this.props.handleKeyCommand) {
      const behavior = this.props.handleKeyCommand(
        this.props.editorState,
        this.props.onChange,
        command,
      );
      if (_isHandled(behavior)) {
        return HANDLED;
      }
    }

    return handleKeyCommand(
      this.props.editorState,
      this.props.onChange,
      command,
    );
  }
  _onBlur(e) {
    e.preventDefault();
    if (this.props.onBlur) {
      const behavior = this.props.onBlur(
        this.props.editorState,
        this.props.onChange,
        e,
      );
      if (_isHandled(behavior)) {
        return HANDLED;
      }
    }
    return NOT_HANDLED;
  }
  _onTab(e) {
    const maxDepth = 4;
    this.props.onChange(RichUtils.onTab(e, this.props.editorState, maxDepth));
  }
  _handleBeforeInput(text) {
    if (this.props.handleBeforeInput) {
      const behavior = this.props.handleBeforeInput(
        this.props.editorState,
        this.props.onChange,
        text,
      );
      if (_isHandled(behavior)) {
        return HANDLED;
      }
    }
    return handleBeforeInput(
      this.props.editorState,
      this.props.onChange,
      text,
    );
  }
  _handlePastedText(text, html) {
    if (this.props.handlePastedText) {
      const behavior = this.props.handlePastedText(
        this.props.editorState,
        this.props.onChange,
        text,
        html,
      );
      if (_isHandled(behavior)) {
        return HANDLED;
      }
    }
    return handlePastedText(
      this.props.editorState,
      this.props.onChange,
      text,
      html,
    );
  }
  _handleBeforeCut() {
    if (this.props.handleBeforeCut) {
      const behavior = this.props.handleBeforeCut(this.props.editorState, this.props.onChange, this.props.userInfo);
      if (_isHandled(behavior)) {
        return HANDLED;
      }
    }
  }
  _handleReturn(e) {
    if (this.props.handleReturn) {
      const behavior = this.props.handleReturn(this.props.editorState, this.props.onChange, e);
      if (_isHandled(behavior)) {
        return HANDLED;
      }
    }

    return handleReturn(
      this.props.editorState,
      this.props.onChange,
      e,
    );
  }
  _handleDrop(selection, dataTransfer, isInternal) {
    let data;
    try {
      data = JSON.parse(dataTransfer.getText());
    } catch (err) {
      console.warn(err);
      return HANDLED;
    }
    if (!this.dragHint.previousSibling) {
      console.warn('dragHint not appending');
      return HANDLED;
    }
    const { editorState, onChange } = this.props;
    const targetBlockKey = this.dragHint.previousSibling.dataset.offsetKey.split('-')[0];

    if (data && data.blockKey !== targetBlockKey) {
      const newEditorState = moveBlock(editorState, data.blockKey, targetBlockKey);
      onChange(newEditorState);
    }
    return HANDLED;
  }
  _handleDroppedFiles(selection, files) {
    if (this.props.uploadFiles) {
      const blockKey = this.dragHint.previousSibling.dataset.offsetKey.split('-')[0];
      const file = files[0];
      const { editorState, onChange } = this.props;
      const key = uploadManager.addTask({
        key: this.uploadManagerKey,
        data: file,
      });
      const newEditorState = appendAtomicBlock(editorState, blockKey, {
        type: ENTITY_TYPE.IMAGE_UPLOADER,
        mutability: 'immutable',
        data: {
          key,
        },
      });
      onChange(newEditorState);
      this.forceSyncWindowSelection = true;
      return HANDLED;
    }
  }
  _handleToggleBlockType(blockType) {
    if (this.props.handleToggleBlockType) {
      const behavior = this.props.handleToggleBlockType(
        this.props.editorState,
        this.props.onChange,
        blockType,
      );
      if (_isHandled(behavior)) {
        return HANDLED;
      }
    }

    return handleToggleBlockType(
      this.props.editorState,
      this.props.onChange,
      blockType,
    );
  }
  _handleToggleInlineStyle(inlineStyle) {
    if (this.props.handleToggleInlineStyle) {
      const behavior = this.props.handleToggleInlineStyle(
        this.props.editorState,
        this.props.onChange,
        inlineStyle,
      );
      if (_isHandled(behavior)) {
        return HANDLED;
      }
    }

    return handleToggleInlineStyle(
      this.props.editorState,
      this.props.onChange,
      inlineStyle,
    );
  }
  render() {
    const {
      className,
      style,
      editorState,
      blockRenderMap,
      onChange,
      placeholder,
      readOnly,
      stripPastedStyles,
      customStyleMap,
    } = this.props;

    return (
      <div
        className={classNames('DraftEditorWrap', className)}
        style={{ ...style, position: 'relative' }}
        onDragOver={(e) => {
          if (!this.props.uploadFiles) {
            return;
          }
          if (this.editorNode._dragCount) {
            const target = e.target;
            const block = target.closest('[data-block]');
            block && block.parentNode.insertBefore(this.dragHint, block.nextSibling);
          }
        }}
        onDragLeave={() => {
          if (!this.props.uploadFiles) {
            return;
          }
          if (this.editorNode._dragCount < 2) {
            this.dragHint.parentNode && this.dragHint.parentNode.removeChild(this.dragHint);
          }
        }}
        onDrop={() => {
          if (!this.props.uploadFiles) {
            return;
          }
          this.dragHint.parentNode && this.dragHint.parentNode.removeChild(this.dragHint);
        }}
      >
        <Editor
          ref={(node) => { this.editorNode = node; }}
          editorState={editorState}
          onChange={onChange}
          blockStyleFn={blockStyleFn}
          blockRenderMap={blockRenderMap}
          customStyleMap={customStyleMap}
          blockRendererFn={this.blockRendererFn}
          keyBindingFn={keyBindingFn}
          handleKeyCommand={this.handleKeyCommand}
          handleBeforeInput={this.handleBeforeInput}
          handlePastedText={this.handlePastedText}
          handleBeforeCut={this.handleBeforeCut}
          handleReturn={this.handleReturn}
          handleDrop={this.handleDrop}
          handleDroppedFiles={this.handleDroppedFiles}
          onTab={this.onTab}
          onBlur={this.onBlur}
          stripPastedStyles={stripPastedStyles}
          placeholder={placeholder}
          readOnly={this.state.readOnly}
        />
      </div>
    );
  }
}

FeatEditor.propTypes = {
  handleKeyCommand: PropTypes.func,
  handleBeforeInput: PropTypes.func,
  handlePastedText: PropTypes.func,
  handleBeforeCut: PropTypes.func,
  handleReturn: PropTypes.func,
  handleDrop: PropTypes.func,
  handleDroppedFiles: PropTypes.func,
  handleToggleBlockType: PropTypes.func,
  handleToggleInlineStyle: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  editorState: PropTypes.object,
  uploadFiles: PropTypes.func,
  autoFocus: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export default FeatEditor;
