import handleTextInsert from './handleTextInsert';

export default function handlePastedText(editorState, onChange, text, html, userInfo) {
  return handleTextInsert(editorState, onChange, text, userInfo);
}
