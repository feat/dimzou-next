import { EditorState } from '@feat/draft-js';
import expandRangeToStartOfLine from '@feat/draft-js/lib/expandRangeToStartOfLine';
import getDraftEditorSelectionWithNodes from '@feat/draft-js/lib/getDraftEditorSelectionWithNodes';

import { isInsideASingleBlock, applyDeleteAnnotation } from '../AnnotationUtils';

import { NOT_HANDLED, HANDLED } from '../../../constants';

function keyCommandBackspaceToStartOfLine(editorState, onChange, userInfo) {
  let contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  if (!selection.isCollapsed()) {
    return HANDLED;
  }
  const domSelection = global.getSelection();
  let range = domSelection.getRangeAt(0);
  range = expandRangeToStartOfLine(range);
  const targetRange = getDraftEditorSelectionWithNodes(
    editorState,
    null,
    range.endContainer,
    range.endOffset,
    range.startContainer,
    range.startOffset,
  ).selectionState;

  const newContentState = applyDeleteAnnotation(contentState, targetRange, userInfo);

  if (contentState === newContentState) {
    return HANDLED;
  }
  contentState = newContentState;

  const finalSelection = targetRange.merge({
    anchorOffset: targetRange.getStartOffset(),
    focusOffset: targetRange.getStartOffset(),
    isBackward: false,
  });

  const newState = EditorState.push(editorState, contentState, 'add-annotation-delete');
  onChange(EditorState.forceSelection(newState, finalSelection));
  return HANDLED;
}

export default function handleKeyCommand(editorState, onChange, command, userInfo) {
  let contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  let targetRange;
  let newState;
  let finalSelection;
  let finalState;
  if (command === 'backspace') {
    if (!isInsideASingleBlock(selection)) {
      return HANDLED;
    }
    if (selection.isCollapsed()) {
      if (selection.getStartOffset() === 0) {
        if (
          contentState
            .getBlockForKey(selection.getStartKey())
            .getData()
            .get('isOrigin')
        ) {
          return HANDLED;
        }
        return NOT_HANDLED;
      }
      targetRange = selection.merge({
        anchorKey: selection.getStartKey(),
        anchorOffset: selection.getStartOffset() - 1,
        focusKey: selection.getEndKey(),
        focusOffset: selection.getEndOffset(),
        isBackward: false,
      });
    } else {
      targetRange = selection;
    }

    const newContentState = applyDeleteAnnotation(contentState, targetRange, userInfo);

    if (contentState === newContentState) {
      return HANDLED;
    }
    contentState = newContentState;

    if (selection.isCollapsed()) {
      finalSelection = targetRange.merge({
        focusOffset: targetRange.getStartOffset(),
      });
    } else {
      finalSelection = targetRange.merge({
        anchorOffset: targetRange.getFocusOffset(),
      });
    }

    newState = EditorState.push(editorState, contentState, 'add-annotation-delete');
    finalState = EditorState.forceSelection(newState, finalSelection);
    onChange(finalState);
    return HANDLED;
  }
  if (command === 'backspace-to-start-of-line') {
    return keyCommandBackspaceToStartOfLine(editorState, onChange, userInfo);
  }
  return NOT_HANDLED;
}
