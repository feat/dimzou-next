import { EditorState, Modifier } from 'draft-js';

import getSelectedBlocks from '../utils/getSelectedBlocks';

import { INLINE_STYLE, BLOCK_TYPE } from '../constants';

const conflictStylesMap = {
  [INLINE_STYLE.BOLD]: [
    INLINE_STYLE.LIGHT,
  ],
  [INLINE_STYLE.LIGHT]: [
    INLINE_STYLE.BOLD,
  ],
};

export function toggleInlineStyle(editorState, inlineStyle) {
  const selection = editorState.getSelection();
  const currentStyle = editorState.getCurrentInlineStyle();
  const blocksList = getSelectedBlocks(editorState);

  // should prevent CODE inlineStyle in code block
  if (inlineStyle === INLINE_STYLE.CODE && blocksList.some(block => block.getType() === BLOCK_TYPE.CODE_BLOCK)) {
    return null;
  }

  // If the selection is collapsed, toggle the specified style on or off and
  // set the result as the new inline style override. This will then be
  // used as the inline style for the next character to be inserted.
  const conflictStyles = conflictStylesMap[inlineStyle];
  if (selection.isCollapsed()) {
    let newCurrentStyle;
    if (currentStyle.has(inlineStyle)) {
      newCurrentStyle = currentStyle.remove(inlineStyle);
    } else {
      newCurrentStyle = currentStyle.add(inlineStyle);
    }
    if (conflictStyles) {
      conflictStyles.forEach((conflictStyle) => {
        if (conflictStyle && newCurrentStyle.has(conflictStyle)) {
          newCurrentStyle = newCurrentStyle.remove(conflictStyle);
        }
      });
    }

    return EditorState.setInlineStyleOverride(
      editorState,
      newCurrentStyle,
    );
  }

  // If characters are selected, immediately apply or remove the
  // inline style on the document state itself.
  const content = editorState.getCurrentContent();
  let newContent;

  // If the style is already present for the selection range, remove it.
  // Otherwise, apply it.
  if (currentStyle.has(inlineStyle)) {
    newContent = Modifier.removeInlineStyle(
      content,
      selection,
      inlineStyle,
    );
  } else {
    newContent = Modifier.applyInlineStyle(
      content,
      selection,
      inlineStyle,
    );
    if (conflictStyles) {
      conflictStyles.forEach((conflictStyle) => {
        if (currentStyle.has(conflictStyle)) {
          newContent = Modifier.removeInlineStyle(
            newContent,
            selection,
            conflictStyle,
          );
        }
      });
    }
  }

  return EditorState.push(
    editorState,
    newContent,
    'change-inline-style',
  );
}


export default function handleToggleInlineStyle(editorState, onChange, inlineStyle) {
  const newEditorState = toggleInlineStyle(editorState, inlineStyle);

  if (newEditorState) {
    onChange(newEditorState);
  }
}
