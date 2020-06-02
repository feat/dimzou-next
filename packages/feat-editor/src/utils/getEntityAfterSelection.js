export default function getEntityAfterRange(contentState, targetRange) {
  const endOffset = targetRange.getEndOffset();
  return contentState.getBlockForKey(targetRange.getStartKey()).getEntityAt(endOffset);
}
