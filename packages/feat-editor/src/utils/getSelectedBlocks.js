const getSelectedBlocks = (editorState) => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  const blocks = [contentState.getBlockForKey(startKey)];
  let target = startKey;
  let nextBlock;
  while (target !== endKey) {
    nextBlock = contentState.getBlockAfter(target);
    if (!nextBlock) {
      break;
    }
    blocks.push(nextBlock);
    target = nextBlock.getKey();
  }
  return blocks;
}
;

export default getSelectedBlocks;
