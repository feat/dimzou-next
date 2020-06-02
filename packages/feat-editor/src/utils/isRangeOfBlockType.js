export default function isRangeOfBlockType(contentState, selection, blockType) {
  let key = selection.getStartKey();
  const endKey = selection.getEndKey();
  let block = contentState.getBlockForKey(key);
  if (block.getType() !== blockType) {
    return false;
  }
  if (key === endKey) {
    return true;
  }
  do {
    block = contentState.getBlockAfter(key);
    if (block.getType() !== blockType) {
      return false;
    }
    key = block.getKey();
  } while (key !== endKey);
  return true;
}
