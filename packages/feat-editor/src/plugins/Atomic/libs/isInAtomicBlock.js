export default function isInMediaBlock(editorState) {
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const currentBlock = content.getBlockForKey(selection.getStartKey());
  return currentBlock && currentBlock.getType() === 'atomic';
}
