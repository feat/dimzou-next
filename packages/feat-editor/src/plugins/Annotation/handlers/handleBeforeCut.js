import { EditorState } from '@feat/draft-js';
import { HANDLED, NOT_HANDLED } from '../../../constants';
import {
  ANNOTATION_ADD,
} from '../constants';
import {
  isInsideASingleBlock,
  isInsideEntityType,
  applyDeleteAnnotation,
} from '../AnnotationUtils';

export default function handleBeforeCut(editorState, onChange, userInfo) {
  let contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  let targetRange,
    entityKey,
    newState,
    finalSelection,
    finalState;
  if (!isInsideASingleBlock(selection)) { return HANDLED; }
  if (selection.isCollapsed()) { return HANDLED; }
  targetRange = selection;

  if (isInsideEntityType(contentState, targetRange, ANNOTATION_ADD)) {
    return NOT_HANDLED;
  }
  const newContentState = applyDeleteAnnotation(contentState, targetRange, userInfo);
  if (newContentState === contentState) {
    return HANDLED;
  }
  contentState = newContentState;


  finalSelection = targetRange.merge({
    anchorOffset: targetRange.getFocusOffset(),
  });
  newState = EditorState.push(editorState, contentState, 'add-annotation-delete');
  finalState = EditorState.forceSelection(newState, finalSelection);
  onChange(finalState);
  return HANDLED;
}
