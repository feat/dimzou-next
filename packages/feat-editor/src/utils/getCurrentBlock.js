import { EditorState, ContentBlock } from 'draft-js';

export default function getCurrentBlock(editorState) {
  const selection = editorState.getSelection();
  const content = editorState.getCurrentContent();
  return content.getBlockForKey(selection.getStartKey());
}
