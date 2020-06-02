import { EditorState, Modifier } from '@feat/draft-js';
import {
  INLINE_STYLE,
} from '../../../constants';

import {
  ANNOTATION_ADD,
  ANNOTATION_DELETE,
  ANNOTATION_STYLE,
} from '../constants';

import {
  isInsideASingleBlock,
  isInsideEntityType,
  updateStyleAnnotation,
  applyStyleAnnotation,
} from '../AnnotationUtils';

import { toggleInlineStyle as defaultToggleInlineStyle } from '../../../handlers/handleToggleInlineStyle';

const conflictStylesMap = {
  [INLINE_STYLE.BOLD]: [
    INLINE_STYLE.LIGHT,
  ],
  [INLINE_STYLE.LIGHT]: [
    INLINE_STYLE.BOLD,
  ],
};

function toggleInlineStyle(editorState, inlineStyle) {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const currentStyle = editorState.getCurrentInlineStyle();
  const conflictStyles = conflictStylesMap[inlineStyle];
  let newContentState;
  let shouldUpdateStyleAnnotation;
  if (!isInsideASingleBlock(selection)) { return null; }
  if (selection.isCollapsed()) {
    let newCurrentStyle;
    if (currentStyle.has(inlineStyle)) {
      newCurrentStyle = currentStyle.remove(inlineStyle);
    } else {
      newCurrentStyle = currentStyle.add(inlineStyle);
      if (conflictStyles) {
        conflictStyles.forEach((conflictStyle) => {
          if (conflictStyle && newCurrentStyle.has(conflictStyle)) {
            newCurrentStyle = newCurrentStyle.remove(conflictStyle);
          }
        });
      }
    }
    return EditorState.setInlineStyleOverride(
      editorState,
      newCurrentStyle,
    );
  }

  const targetRange = selection;

  if (isInsideEntityType(contentState, targetRange, ANNOTATION_ADD)) {
    return defaultToggleInlineStyle(editorState, inlineStyle);
  }
  if (isInsideEntityType(contentState, targetRange, ANNOTATION_DELETE)) {
    return null;
  }
  if (!isInsideEntityType(contentState, targetRange, ANNOTATION_STYLE)) {
    newContentState = applyStyleAnnotation(contentState, targetRange);
  } else {
    shouldUpdateStyleAnnotation = true;
    newContentState = contentState;
  }

  if (!shouldUpdateStyleAnnotation && newContentState === contentState) {
    return null;
  }
  if (currentStyle.has(inlineStyle)) {
    newContentState = Modifier.removeInlineStyle(
      newContentState,
      targetRange,
      inlineStyle,
    );
  } else {
    newContentState = Modifier.applyInlineStyle(
      newContentState,
      targetRange,
      inlineStyle,
    );
    if (conflictStyles) {
      conflictStyles.forEach((conflictStyle) => {
        if (currentStyle.has(conflictStyle)) {
          newContentState = Modifier.removeInlineStyle(
            newContentState,
            selection,
            conflictStyle,
          );
        }
      });
    }
  }

  if (shouldUpdateStyleAnnotation) {
    newContentState = updateStyleAnnotation(newContentState, targetRange);
  }

  return EditorState.push(
    editorState,
    newContentState,
    'change-inline-style',
  );
}

export default function handleToggleInlineStyle(editorState, onChange, inlineStyle, userInfo) {
  const newEditorState = toggleInlineStyle(editorState, inlineStyle, userInfo);
  if (newEditorState) {
    onChange(newEditorState);
  }
}
