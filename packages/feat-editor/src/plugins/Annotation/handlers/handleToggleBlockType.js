import { EditorState } from '@feat/draft-js';

import {
  HANDLED,
} from '../../../constants';

import {
  toggleBlockType,
} from '../AnnotationUtils';

export default function handleToggleBlockType(editorState, onChange, blockType) {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const newContentState = toggleBlockType(contentState, selection, blockType);

  if (newContentState !== contentState) {
    onChange(
      EditorState.push(editorState, newContentState, 'toggle-block-type'),
    );
  }

  return HANDLED;
}
