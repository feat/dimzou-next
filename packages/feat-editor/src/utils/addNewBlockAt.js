import { Map, List } from 'immutable';
import { EditorState, ContentBlock, genKey } from 'draft-js';

import defaultBlockData from '../model/defaultBlockData';

export default function addNewBlockAt(
  editorState,
  pivotBlockKey,
  placement = 'after',
  newBlockType = 'unstyled',
  initialData = {},
  changeType = 'add-block',
) {
  const content = editorState.getCurrentContent();
  const blockMap = content.getBlockMap();
  const block = blockMap.get(pivotBlockKey);
  if (!block) {
    throw new Error(`The pivot key - ${pivotBlockKey} is not present in blockMap.`);
  }
  const blocksBefore = blockMap.toSeq().takeUntil(v => (v === block));
  const blocksAfter = blockMap.toSeq().skipUntil(v => (v === block)).rest();
  const newBlockKey = genKey();

  const newBlock = new ContentBlock({
    key: newBlockKey,
    type: newBlockType,
    text: '',
    characterList: List(),
    depth: 0,
    data: Map(Object.assign({}, defaultBlockData[newBlockType], initialData)),
  });

  const orderArr = placement === 'after' ?
        [[pivotBlockKey, block], [newBlockKey, newBlock]] :
        [[newBlockKey, newBlock], [pivotBlockKey, block]];

  const newBlockMap = blocksBefore.concat(
        orderArr,
        blocksAfter,
    ).toOrderedMap();

  const selection = editorState.getSelection();

  const newContent = content.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: selection.merge({
      anchorKey: newBlockKey,
      anchorOffset: 0,
      focusKey: newBlockKey,
      focusOffset: 0,
      isBackward: false,
    }),
  });
  return EditorState.push(editorState, newContent, changeType);
}
