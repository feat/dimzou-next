import { EditorState, Modifier } from 'draft-js';

export default function handlePastedText(text, html, editorState) {
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const newContent = Modifier.replaceText(content, selection, text);

  return EditorState.push(editorState, newContent, 'paste-code');
}
