import React from 'react';
import PropTypes from 'prop-types';

import StyleButton from './StyleButton';

function headerInRange(editorState) {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  const blockMap = contentState.getBlockMap();
  const rangeBlock = blockMap
    .skipUntil((b) => b.getKey() === startKey)
    .takeUntil((b) => b.getKey() === endKey)
    .toList().push(blockMap.get(endKey));
  return rangeBlock.some((block) => block.getType().indexOf('header') === 0);
}

function InlineToolbar (props) {
  const currentStyle = props.editorState && props.editorState.getCurrentInlineStyle();
  const hasHeader = props.editorState && headerInRange(props.editorState);
  return (
    <div className="dz-EditorControls dz-EditorControls_inline">
      {props.buttons.map((button) => (
        <StyleButton
          key={button.style}
          {...button}
          disabled={!props.editorState || button.disabled || (hasHeader && button.style === 'BOLD')}
          isActive={currentStyle ? currentStyle.has(button.style) : false}
          onToggle={props.onToggle}
        />
      ))}
    </div>
  );
}

InlineToolbar.propTypes = {
  buttons: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
  editorState: PropTypes.object,
};

export default InlineToolbar;
