import { EditorState, RichUtils, Modifier, KeyBindingUtil } from 'draft-js';
import { BLOCK_TYPE } from '../../constants';

function isInBlockquote(editorState) {
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const currentBlock = content.getBlockForKey(selection.getStartKey());
  return currentBlock && currentBlock.getType() === BLOCK_TYPE.BLOCKQUOTE;
}

function handleReturn(e, editorState) {
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  if (selection.isCollapsed() && KeyBindingUtil.hasCommandModifier(e)) {
    const splitBlock = Modifier.splitBlock(content, selection);
    const afterSelection = splitBlock.getSelectionAfter();
    const resetedContent = Modifier.setBlockType(splitBlock, afterSelection, 'unstyled');
    return EditorState.push(editorState, resetedContent, 'exit-blockquote');
  }

  return RichUtils.insertSoftNewline(editorState);
}

export default {
  isInBlockquote,
  handleReturn,
};
