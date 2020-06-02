import { Modifier, EditorState } from '@feat/draft-js';
import { BLOCK_TYPE } from '../constants/';

export default function appendAtomicBlock(editorState, blockKey, entityConfig) {
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(blockKey);
  const selection = editorState.getSelection().merge({
    anchorKey: blockKey,
    anchorOffset: block.getLength(),
    focusKey: blockKey,
    focusOffset: block.getLength(),
    isBackward: false,
  });
  const blockInserted = Modifier.splitBlock(content, selection);
  const blockChanged = Modifier.setBlockType(
    blockInserted,
    blockInserted.getSelectionAfter(),
    BLOCK_TYPE.ATOMIC,
  );
  const entityCreated = blockChanged.createEntity(
    entityConfig.type,
    entityConfig.multability,
    entityConfig.data,
  );
  const entityKey = entityCreated.getLastCreatedEntityKey();
  let newContent = Modifier.insertText(
    entityCreated,
    entityCreated.getSelectionAfter(),
    ' ',
    undefined,
    entityKey,
  );
  if (blockKey === content.getLastBlock().getKey()) {
    newContent = Modifier.splitBlock(newContent, newContent.getSelectionAfter());
    newContent = Modifier.setBlockType(
      newContent,
      newContent.getSelectionAfter(),
      BLOCK_TYPE.UNSTYLED,
    );
  }

  return EditorState.push(editorState, newContent, 'insert-atomic-block');
}
