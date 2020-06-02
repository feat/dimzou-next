import { RichUtils, EditorState, Modifier, SelectionState } from 'draft-js';
import { HANDLED, NOT_HANDLED, BLOCK_TYPE } from '../constants';
import isHandled from '../utils/isHandled';
import CodeBlockUtils from '../plugins/CodeBlock';

const blockResetFirst = [
  BLOCK_TYPE.ORDERED_LIST_ITEM,
  BLOCK_TYPE.UNORDERED_LIST_ITEM,
  BLOCK_TYPE.CODE_BLOCK,
  BLOCK_TYPE.BLOCKQUOTE,
];

function handleSelectAll(editorState, onChange) {
  const content = editorState.getCurrentContent();
  const blockMap = content.getBlockMap();
  const newSelection = new SelectionState({
    anchorKey: blockMap.first().getKey(),
    anchorOffset: 0,
    focusKey: blockMap.last().getKey(),
    focusOffset: blockMap.last().getLength(),
  });
  onChange(EditorState.forceSelection(editorState, newSelection));
  return HANDLED;
}

function handleBackspace(editorState, onChange) {
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const currentBlock = content.getBlockForKey(selection.getStartKey());

  if (
    selection.isCollapsed() &&
    selection.getAnchorOffset() === 0 &&
    currentBlock.getText() === '' &&
    blockResetFirst.indexOf(currentBlock.getType()) > -1
  ) {
    const resetBlockType = Modifier.setBlockType(content, selection, 'unstyled');
    onChange(EditorState.push(editorState, resetBlockType, 'change-block-type'));
    return HANDLED;
  }

  if (currentBlock.getType() === 'atomic') {
    const blockMap = content.getBlockMap();
    const blockBefore = content.getBlockBefore(currentBlock.getKey());
    const newBlockMap = blockMap.delete(currentBlock.getKey());
    const newContent = content.set('blockMap', newBlockMap);
    const newSelection = new SelectionState({
      anchorKey: blockBefore.getKey(),
      focusKey: blockBefore.getKey(),
      anchorOffset: blockBefore.getLength(),
      focusOffset: blockBefore.getLength(),
    });
    const newState = EditorState.push(editorState, newContent, 'delete-atomic-block');
    onChange(EditorState.forceSelection(newState, newSelection));
    return HANDLED;
  }
}

export default function handleKeyCommand(editorState, onChange, command) {
  let newEditorState;
  let customHandled;

  if (CodeBlockUtils.isInCodeBlock(editorState)) {
    newEditorState = CodeBlockUtils.handleKeyCommand(command, editorState);
    if (newEditorState) {
      onChange(newEditorState);
      return HANDLED;
    }
  }
  if (command === 'backspace') {
    customHandled = handleBackspace(editorState, onChange);
    if (isHandled(customHandled)) {
      return HANDLED;
    }
  }

  if (command === 'select-all') {
    return handleSelectAll(editorState, onChange);
  }

  // newEditorState = RichUtils.handleKeyCommand(editorState, command);
  // if (newEditorState) {
  //   onChange(newEditorState);
  //   return HANDLED;
  // }
  return NOT_HANDLED;
}
