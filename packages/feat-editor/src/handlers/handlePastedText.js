import { BLOCK_TYPE, HANDLED, NOT_HANDLED } from '../constants';
import CodeBlockUtils from '../plugins/CodeBlock';

export default function handlePastedText(editorState, onChange, text, html) {
  let newEditorState;
  if (CodeBlockUtils.isInCodeBlock(editorState)) {
    newEditorState = CodeBlockUtils.handlePastedText(text, html, editorState);
    onChange(newEditorState);
    return HANDLED;
  }
}
