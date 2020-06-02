import { EditorState, RichUtils, KeyBindingUtil, SelectionState } from '@feat/draft-js';
import addNewBlockAt from '../../../utils/addNewBlockAt';

export default function handleReturn(e, editorState) {
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  if (selection.isCollapsed() && KeyBindingUtil.hasCommandModifier(e)) {
    const currentKey = selection.getStartKey();
    if (currentKey === content.getLastBlock().getKey()) {
      return addNewBlockAt(
        editorState,
        currentKey,
        'after',
        'unstyled',
        undefined,
        'exit-code-block',
      );
    }
    const newSelection = new SelectionState({
      anchorKey: content.getKeyAfter(currentKey),
      focusKey: content.getKeyAfter(currentKey),
      anchoroffset: 0,
      focusOffset: 0,
    });
    return EditorState.forceSelection(editorState, newSelection);

    // const splitBlock = Modifier.splitBlock(content, selection);
    // const afterSelection = splitBlock.getSelectionAfter();
    // const resetedContent = Modifier.setBlockType(splitBlock, afterSelection, "unstyled");
    // return EditorState.push(editorState, resetedContent, "exit-code-block");
  }

  return RichUtils.insertSoftNewline(editorState);
}
