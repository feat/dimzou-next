import { RichUtils } from 'draft-js';
import CodeBlockUtils from '../plugins/CodeBlock';

export default function handleTab(editorState, onChange, e) {
  if (CodeBlockUtils.isInCodeBlock(editorState)) {
    const newEditorState = CodeBlockUtils.handleTab(e, editorState);
    newEditorState && onChange(newEditorState);
    return;
  }

  const maxDepth = 4;
  onChange(RichUtils.onTab(e, editorState, maxDepth));
}
