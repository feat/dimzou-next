export default function getEntityRangeInBlock(contentBlock, entityKey) {
  const start = contentBlock.getCharacterList().findIndex(char => char.getEntity() === entityKey);
  const end = contentBlock.getCharacterList().findLastIndex(char => char.getEntity() === entityKey);

  if (start > -1 && end > -1) {
    return [start, end + 1];
  }
  return null;
}
