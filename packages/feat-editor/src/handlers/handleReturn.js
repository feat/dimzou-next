import { EditorState, Modifier, ContentBlock, genKey } from 'draft-js';
import { List, OrderedSet } from 'immutable';
import CodeBlockUtils from '../plugins/CodeBlock';
import BlockquoteUtils from '../plugins/Blockquote';
import AutoMarkdownUtils from '../plugins/AutoMarkdown';
import AtomicUtils from '../plugins/Atomic';
import { BLOCK_TYPE, HANDLED, NOT_HANDLED, INLINE_STYLE } from '../constants';

import addNewBlockAt from '../utils/addNewBlockAt';

const resetBlockTypes = [BLOCK_TYPE.UNORDERED_LIST_ITEM, BLOCK_TYPE.ORDERED_LIST_ITEM];

export default function handleReturn(editorState, onChange, e) {
  let newEditorState;

  if (CodeBlockUtils.isInCodeBlock(editorState)) {
    newEditorState = CodeBlockUtils.handleReturn(e, editorState);
    newEditorState && onChange(newEditorState);
    return HANDLED;
  }

  if (BlockquoteUtils.isInBlockquote(editorState)) {
    newEditorState = BlockquoteUtils.handleReturn(e, editorState);
    newEditorState && onChange(newEditorState);
    return HANDLED;
  }

  if (AtomicUtils.isInAtomicBlock(editorState)) {
    newEditorState = AtomicUtils.handleReturn(e, editorState);
    newEditorState && onChange(newEditorState);
    return HANDLED;
  }

  newEditorState = AutoMarkdownUtils.handleReturn(e, editorState);
  if (newEditorState) {
    onChange(newEditorState);
    return HANDLED;
  }

  // TODO move to a base plugin
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const currentBlock = content.getBlockForKey(selection.getStartKey());
  const blockType = currentBlock.getType();

  // insert blockBefore. 保持 blockKey 一致
  if (selection.getStartOffset() === 0 && currentBlock.getLength()) {
    const removed = Modifier.removeRange(content, selection);
    const emptyBlockKey = genKey();
    const emptyBlock = new ContentBlock({
      key: emptyBlockKey,
      text: '',
      type: BLOCK_TYPE.UNSTYLED,
      characterList: List(),
      depth: 0,
    });
    const targetKey = removed.getSelectionAfter().getStartKey();
    const blocksBefore = content
      .getBlockMap()
      .toSeq()
      .takeUntil(block => block.getKey() === targetKey);
    const blocksAfter = content
      .getBlockMap()
      .toSeq()
      .skipUntil(block => block.getKey() === targetKey)
      .rest();
    const newBlockMap = blocksBefore
      .concat(
        [[emptyBlockKey, emptyBlock], [targetKey, content.getBlockForKey(targetKey)]],
        blocksAfter,
      )
      .toOrderedMap();

    const newContent = removed.merge({
      blockMap: newBlockMap,
    });

    newEditorState = EditorState.push(editorState, newContent, 'split-block');
    onChange(newEditorState);
    return HANDLED;
  }

  // 标题 换行重置
  if (blockType.indexOf('header') > -1) {
    const splited = Modifier.splitBlock(content, selection);
    const resetBlockType = Modifier.setBlockType(
      splited,
      splited.getSelectionAfter(),
      BLOCK_TYPE.UNSTYLED,
    );
    newEditorState = EditorState.push(editorState, resetBlockType);
    onChange(newEditorState);
    return HANDLED;
  }

  if (
    resetBlockTypes.indexOf(blockType) !== -1 &&
    selection.isCollapsed &&
    selection.getAnchorOffset() === 0
  ) {
    const blockReset = Modifier.setBlockType(content, selection, BLOCK_TYPE.UNSTYLED);
    newEditorState = EditorState.push(editorState, blockReset);
    onChange(newEditorState);
    return HANDLED;
  }

  if (blockType === 'atomic') {
    newEditorState = addNewBlockAt(editorState, currentBlock.getKey());
    onChange(newEditorState);
    return HANDLED;
  }

  // reset inline style when split block
  const newState = Modifier.splitBlock(content, selection);
  const selectionAfter = newState.getSelectionAfter();
  newEditorState = EditorState.push(editorState, newState);
  const blockLength = newState.getBlockForKey(selectionAfter.getStartKey()).getLength();
  if (blockLength === 0) {
    newEditorState = EditorState.setInlineStyleOverride(newEditorState, new OrderedSet());
  }
  onChange(newEditorState);
  return HANDLED;
}
