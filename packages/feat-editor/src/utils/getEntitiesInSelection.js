export default function getEntitiesInSelection(content, selection) {
  const entities = [];
  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  const startOffset = selection.getStartOffset();
  const endOffset = selection.getEndOffset();

  let block;
  const loopRange = {};
  let blockKey = startKey;

  while (true) {
    block = content.getBlockForKey(blockKey);
    loopRange.start = blockKey === startKey ? startOffset : 0;
    loopRange.end = blockKey === endKey ? endOffset : block.getLength();

    for (let i = loopRange.start; i < loopRange.end; i++) {
      const entityKey = block.getEntityAt(i);
      if (entityKey && entities.indexOf(entityKey) === -1) {
        entities.push(entityKey);
      }
    }
    if (blockKey === endKey) { break; }
    blockKey = content.getKeyAfter(blockKey);
  }

  return entities;
}
