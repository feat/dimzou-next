export default function isInCodeBlock(editorState) {
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const currentBlock = content.getBlockForKey(selection.getStartKey());
  return currentBlock && currentBlock.getType() === 'code-block';
}
