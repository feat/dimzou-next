import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';

import createModeToggleBlock from '@feat/feat-editor/lib/handlers/handleToggleBlock';
import updateModeToggleBlock from '@feat/feat-editor/lib/plugins/Annotation/handlers/handleToggleBlockType';
import createModeToggleInlineStyle from '@feat/feat-editor/lib/handlers/handleToggleInlineStyle';
import updateModeToggleInlineStyle from '@feat/feat-editor/lib/plugins/Annotation/handlers/handleToggleInlineStyle';

import BlockToolbar from './BlockToolbar';
import InlineToolbar from './InlineToolbar';

import {
  CODE_BLOCK,
  H2,
  // BLOCKQUOTE,
  UL,
  // OL,
  BOLD,
  ITALIC,
  // CODE,
  LIGHT,
} from './buttonConfig';

class DimzouEditorToolbar extends Component {
  getBlockButtons() {
    const { structure } = this.props;
    const base = [
      H2,
      UL,
      // OL,
      CODE_BLOCK,
      // BLOCKQUOTE
    ];
    if (structure === 'content') {
      return base;
    }
    return base.map((item) => ({
      ...item,
      disabled: true,
    }));
  }

  getInlineButtons() {
    const base = [
      BOLD,
      ITALIC,
      LIGHT,
      // CODE
    ];

    const { structure } = this.props;
    if (structure === 'title') {
      return base.map((item) => ({
        ...item,
        disabled: true,
      }));
    }
    return base;
  }

  handleToggleBlockType = (blockType) => {
    const { editorState, onChange, mode } = this.props;
    if (!editorState) {
      return undefined;
    }
    if (mode === 'create') {
      return createModeToggleBlock(editorState, onChange, blockType);
    }
    return updateModeToggleBlock(editorState, onChange, blockType);
  };

  handleToggleInlineType = (style) => {
    const { editorState, onChange, mode } = this.props;
    if (!editorState) {
      return undefined;
    }
    if (mode === 'create') {
      return createModeToggleInlineStyle(editorState, onChange, style);
    }
    return updateModeToggleInlineStyle(editorState, onChange, style);
  };

  handleUndo = (e) => {
    e.preventDefault();

    this.props.onChange(EditorState.undo(this.props.editorState));
  };

  handleRedo = (e) => {
    e.preventDefault();
    this.props.onChange(EditorState.redo(this.props.editorState));
  };

  render() {
    const { editorState, className } = this.props;
    const blockButtons = this.getBlockButtons();
    const inlineButtons = this.getInlineButtons();
    return (
      <div className={className}>
        {blockButtons &&
          !!blockButtons.length && (
            <BlockToolbar
              editorState={editorState}
              buttons={blockButtons}
              onToggle={this.handleToggleBlockType}
            />
          )}
        {/* <span className="dz-DockerSeparator" /> */}
        {inlineButtons &&
          !!inlineButtons.length && (
            <InlineToolbar
              buttons={inlineButtons}
              onToggle={this.handleToggleInlineType}
              editorState={editorState}
            />
          )}
        {/* {(blockButtons || inlineButtons) && (
          <span className="dz-EditorButtonDivider" />
        )}
        <Button
          type="merge"
          className="dz-EditorButton"
          disabled={!editorState || editorState.getUndoStack().size === 0}
          onMouseDown={this.handleUndo}
        >
          <Icon name="undo" />
        </Button>
        <Button
          type="merge"
          className="dz-EditorButton"
          disabled={!editorState || editorState.getRedoStack().size === 0}
          onMouseDown={this.handleRedo}
        >
          <Icon name="redo" />
        </Button> */}
      </div>
    );
  }
}

DimzouEditorToolbar.propTypes = {
  className: PropTypes.string,
  editorState: PropTypes.object,
  onChange: PropTypes.func,
  mode: PropTypes.oneOf(['create', 'update']),
  structure: PropTypes.oneOf(['title', 'summary', 'content']),
};

export default DimzouEditorToolbar;
