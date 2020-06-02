import handleTextInsert from './handleTextInsert';

export default function handleBeforeInput(editorState, onChange, text, userInfo) {
  return handleTextInsert(editorState, onChange, text, userInfo);
}
