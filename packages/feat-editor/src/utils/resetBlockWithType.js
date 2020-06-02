import { Map } from 'immutable';
import { EditorState, Modifier } from 'draft-js';
import { BLOCK_TYPE, INLINE_STYLE } from '../constants';

export default function resetBlockWithType(
  editorState,
  newType = BLOCK_TYPE.UNSTYLED,
  overrides = {},
) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const block = blockMap.get(key);
  const newBlock = block.mergeDeep(overrides, {
    type: newType,
    data: Map(),
  });
  const selectionAfter = selectionState.merge({
    anchorOffset: 0,
    focusOffset: 0,
  });

  let newContentState = contentState.merge({
    blockMap: blockMap.set(key, newBlock),
  });

  if (newType.indexOf('header') === 0) {
    // clean up bold inline style
    newContentState = Modifier.removeInlineStyle(newContentState, selectionState.merge({
      anchorOffset: 0,
      focusOffset: newBlock.getLength(),
    }), INLINE_STYLE.BOLD);
  }

  newContentState = newContentState.set('selectionAfter', selectionAfter);

  return EditorState.push(editorState, newContentState, 'change-block-type');
}
