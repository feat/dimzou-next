export default function getEntityBeforeRange(contentState, targetRange) {
  const startOffset = targetRange.getStartOffset();
  if (startOffset > 0) {
    return contentState.getBlockForKey(targetRange.getStartKey()).getEntityAt(startOffset - 1);
  }
  return null;
}
