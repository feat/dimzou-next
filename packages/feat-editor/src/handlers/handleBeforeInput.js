import AutoMarkdown from '../plugins/AutoMarkdown';
import { HANDLED, NOT_HANDLED } from '../constants';

export default function handleBeforeInput(editorState, onChange, text) {
  const newEditorState = AutoMarkdown.handleBeforeInput(text, editorState);
  if (newEditorState) {
    onChange(newEditorState);
    return HANDLED;
  }
  return NOT_HANDLED;
}
